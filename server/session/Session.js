import WASocket, { Browsers, isJidBroadcast, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import qrcode from "qrcode";
import fs from "fs";
import NodeCache from "node-cache"
import { modules } from "../../lib/index.js";
import { socket, moment } from "../config/index.js";
import config from "../config/config.js";
import SessionDatabase from "../database/db/session.db.js";
import Message from "./Client/handler/Message.js";
import {VipGrup} from "../database/db/messageRespon.db.js";

const { SESSION_PATH, LOG_PATH } = process.env;
let sessions = {};

class ConnectionSession extends SessionDatabase {
	constructor() {
		super();
		this.sessionPath = SESSION_PATH;
		this.logPath = LOG_PATH;
		this.count = 0;
	}

	getClient() {
		return sessions ?? null;
	}

	async deleteSession(session_name) {
		if (fs.existsSync(`${this.sessionPath}/${session_name}`)) fs.rmSync(`${this.sessionPath}/${session_name}`, { force: true, recursive: true });
		if (fs.existsSync(`${this.sessionPath}/store/${session_name}.json`)) fs.unlinkSync(`${this.sessionPath}/store/${session_name}.json`);
		if (fs.existsSync(`${this.logPath}/${session_name}.txt`)) fs.unlinkSync(`${this.logPath}/${session_name}.txt`);
		await this.deleteSessionDB(session_name);
		sessions = {};
	}

	async generateQr(input, session_name) {
		let rawData = await qrcode.toDataURL(input, { scale: 8 });
		let dataBase64 = rawData.replace(/^data:image\/png;base64,/, "");
		await modules.sleep(3000);
		socket.emit(`update-qr`, { buffer: dataBase64, session_name });
		this.count++;
		console.log(modules.color("[SYS]", "#EB6112"), modules.color(`[Session: ${session_name}] Open the browser, a qr has appeared on the website, scan it now!`, "#E6B0AA"));
		console.log(this.count);
	}

	async createSession(session_name) {
		const sessionDir = `${this.sessionPath}/${session_name}`;
		const storePath = `${this.sessionPath}/store/${session_name}.json`;
		let { state, saveCreds } = await useMultiFileAuthState(sessionDir);
		const { version, isLatest } = await fetchLatestBaileysVersion();
		const msgRetryCounterCache = new NodeCache()

		const options = {
			printQRInTerminal: false,
			auth: state,
			logger: pino({ level: "error" }),
			browser: Browsers.macOS('Desktop'),
        	version: [2,2335,9],
			syncFullHistory: true,
			generateHighQualityLinkPreview: true,
			msgRetryCounterCache,
			shouldIgnoreJid: jid => isJidBroadcast(jid),
		};

		const store = makeInMemoryStore({});
		store.readFromFile(storePath);

		const client = WASocket.default(options);

		store.readFromFile(storePath);
		setInterval(() => {
			store.writeToFile(storePath);
		}, 10_000);
		store.bind(client.ev);
		sessions = { ...client, isStop: false };

		client.ev.on("creds.update", saveCreds);
		client.ev.on("connection.update", async (update) => {
			if (this.count >= 3) {
				this.deleteSession(session_name);
				socket.emit("connection-status", { session_name, result: "No Response, QR Scan Canceled" });
				console.log(`Count : ${this.count}, QR Stopped!`);
				client.ev.removeAllListeners("connection.update");
				return;
			}

			if (update.qr) this.generateQr(update.qr, session_name);

			if (update.isNewLogin) {
				await this.createSessionDB(session_name, client.authState.creds.me.id.split(":")[0]);
				let files = `${this.logPath}/${session_name}.txt`;
				if (fs.existsSync(files)) {
					var readLog = fs.readFileSync(files, "utf8");
				} else {
					fs.writeFileSync(files, `Success Create new Session : ${session_name}, ${client.authState.creds.me.id.split(":")[0]}\n`);
					var readLog = fs.readFileSync(files, "utf8");
				}
				return socket.emit("logger", { session_name, result: readLog, files, session_number: client.authState.creds.me.id.split(":")[0], status: "CONNECTED" });
			}

			const { lastDisconnect, connection } = update;
			if (connection === "close") {
				const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
				if (reason === DisconnectReason.badSession) {
					console.log(modules.color("[SYS]", "#EB6112"), modules.color(`Bad Session File, Please Delete [Session: ${session_name}] and Scan Again`, "#E6B0AA"));
					this.deleteSession(session_name);
					client.logout();
					return socket.emit("connection-status", { session_name, result: "Bad Session File, Please Create QR Again" });
				} else if (reason === DisconnectReason.connectionClosed) {
					const checked = this.getClient();
					if (checked.isStop == false) {
						console.log(modules.color("[SYS]", "#EB6112"), modules.color(`[Session: ${session_name}] Connection closed, reconnecting....`, "#E6B0AA"));
						this.createSession(session_name);
					} else if (checked.isStop == true) {
						await this.updateStatusSessionDB(session_name, "STOPPED");
						console.log(modules.color("[SYS]", "#EB6112"), modules.color(`[Session: ${session_name}] Connection close Success`, "#E6B0AA"));
						socket.emit("session-status", { session_name, status: "STOPPED" });
					}
				} else if (reason === DisconnectReason.connectionLost) {
					console.log(modules.color("[SYS]", "#EB6112"), modules.color(`[Session: ${session_name}] Connection Lost from Server, reconnecting...`, "#E6B0AA"));
					this.createSession(session_name);
				} else if (reason === DisconnectReason.connectionReplaced) {
					console.log(modules.color("[SYS]", "#EB6112"), modules.color(`[Session: ${session_name}] Connection Replaced, Another New Session Opened, Please Close Current Session First`, "#E6B0AA"));
					client.logout();
					return socket.emit("connection-status", { session_name, result: `[Session: ${session_name}] Connection Replaced, Another New Session Opened, Please Create QR Again` });
				} else if (reason === DisconnectReason.loggedOut) {
					console.log(modules.color("[SYS]", "#EB6112"), modules.color(`Device Logged Out, Please Delete [Session: ${session_name}] and Scan Again.`, "#E6B0AA"));
					client.logout();
					return socket.emit("connection-status", { session_name, result: `[Session: ${session_name}] Device Logged Out, Please Create QR Again` });
				} else if (reason === DisconnectReason.restartRequired) {
					console.log(modules.color("[SYS]", "#EB6112"), modules.color(`[Session: ${session_name}] Restart Required, Restarting...`, "#E6B0AA"));
					this.createSession(session_name);
				} else if (reason === DisconnectReason.timedOut) {
					console.log(modules.color("[SYS]", "#EB6112"), modules.color(`[Session: ${session_name}] Connection TimedOut, Reconnecting...`, "#E6B0AA"));
					this.createSession(session_name);
				} else {
					client.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`);
				}
			} else if (connection == "open") {
				await this.updateStatusSessionDB(session_name, "CONNECTED");
				socket.emit("session-status", { session_name, status: "CONNECTED" });
				console.log(
					modules.color("[SYS]", "#EB6112"),
					modules.color(moment().format("DD/MM/YY HH:mm:ss"), "#F8C471"),
					modules.color(`[Session: ${session_name}] Session is Now Connected - Baileys Version ${version}, isLatest : ${isLatest}`, "#82E0AA")
				);
			}
		});

		client.ev.on("messages.upsert", async ({ messages, type }) => {
			if (type === "notify") {
				const message = new Message(client, { messages, type }, session_name);
				message.mainHandler();
			}
		});

		client.ev.on("group-participants.update", async ({ id, participants, action }) => {
			const metadata = await client.groupMetadata(id)
			
			if (await VipGrup.ceksubs(id) && await VipGrup.cekwelcome(id) && action === "add") {
				const addedParticipants = participants.filter((participant) => participant !== client.user.jid);
				const taggedParticipants = addedParticipants.map((participant) => `@${participant.split("@")[0]}`).join(" ");
				let wmessage;
const welcomeMessage = await VipGrup.getGroup(id).welcomemsg;
if (welcomeMessage) {
    wmessage = welcomeMessage;
} else {
    wmessage = "Admin grup belum menambahkan pesan selamat datang, hubungi [Revanda] 085159199040 untuk menambahkan pesan selamat datang.";
}

const message = `*Chizuru-chan🌸*
                
Selamat datang di *${metadata.subject}* kak ${taggedParticipants}. Semoga betah disini ya🌸

${wmessage}

Grup: ${metadata.subject}
Jumlah member: ${metadata.participants.length} member`;
				await client.sendMessage(id, {text: `${message}`, contextInfo: {
					mentionedJid: participants,
					externalAdReply: {
					 title: "Chizuru-Chan",
					 body: "Chizuru Bot by Revanda",
					 mediaType: 1,
					 previewType: 0,
					 renderLargerThumbnail: true,
					 thumbnail: fs.readFileSync("./public/image/chizu.png"),
					 sourceUrl: "https://revandastore.com"
					}}});
			} else if (await VipGrup.ceksubs(id) && await VipGrup.cekout(id) && action === "remove") {
				const removedParticipants = participants.filter((participant) => participant !== client.user.jid);
				const taggedParticipants = removedParticipants.map((participant) => `@${participant.split("@")[0]}`).join(" ");
				const message = `*Chizuru-chan🌸*

Sayonara kak ${taggedParticipants}, semoga tenang diluar sana. Karangan bunganya chizu titip admin ya🌸`;
				await client.sendMessage(id, {text: `${message}`, contextInfo: {
						mentionedJid: participants,
					   externalAdReply: {
						title: "Chizuru-Chan",
						body: "Chizuru Bot by Revanda",
						mediaType: 1,
						previewType: 0,
						renderLargerThumbnail: true,
						thumbnail: fs.readFileSync("./public/image/chizu.png"),
						sourceUrl: "https://revandastore.com"
					   }}});
			}
		});

		const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN:Randa Yoga Saputra\n' // full name
            + 'ORG:Revanda Store;\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=6285159199040:+62 851 5919 9040\n' // WhatsApp ID + phone number
            + 'END:VCARD'
		client.ev.on("call", async (json) => {
			if (config.options.antiCall) {
			   for (const id of json) {
				  if (id.status === "offer") {
					 await client.sendMessage(id.from, {
						text: `Maaf untuk saat ini, Kami tidak dapat menerima panggilan, entah dalam group atau pribadi\n\nJika Membutuhkan bantuan ataupun request fitur silahkan chat owner`,
						mentions: [id.from],
					 })
					 await client.sendMessage(id.from, { 
						contacts: { 
							displayName: 'Revanda', 
							contacts: [{ vcard }] 
						}
					})
					 await client.rejectCall(id.id, id.from)
				  }
			   }
			}
		 })
	}
}

export default ConnectionSession;
