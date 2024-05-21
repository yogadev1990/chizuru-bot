import { AutoReply, ButtonResponse, ListResponse, Trigger, VipGrup} from "../../../database/db/messageRespon.db.js";
import Client from "./Client.js";
import Serialize from "./Serialize.js";
import axios from "axios";
import cheerio from "cheerio";
import { moment } from "../../../config/index.js";
import turl from "turl";
import badwords from './dictionary/badwords.json' assert { type: 'json' };
import linklist from './dictionary/linklist.json' assert { type: 'json' };

export default class Message extends Serialize {
	constructor(client, msg, session_name) {
		super();
		this.session = session_name;
		this.client = client;
		this.msg = msg.messages;
		this.type = msg.type;
	}
	
	async mainHandler() {
		try {
			if (!this.msg) return;
			const message = this.msg[0];
			if (message.key && message.key.remoteJid === "status@broadcast") return;
			if (!message.message) return;
			const m = await this.serial(this.client, message);

			const bot = new Client(this.client, m.from);
			const CMD = m.command ? m.command : null;
			if (!CMD) return this.messageHandler(m, bot);
		} catch (error) {
			console.log(error);
		}
	}

	async messageHandler(m, bot) {
		const buttonResponse = new ButtonResponse();
		const listResponse = new ListResponse();
		const replyResponse = new AutoReply();
		const keywordReply = await replyResponse.checkMessageUser(m.botNumber, m.body);
		const keywordButton = await buttonResponse.checkKeyword(m.body, m.from);
		const keywordList = await listResponse.checkKeyword(m.body, m.from);
		const waktuSaatIni = new Date();
		const namaBulan = [
			"Januari", "Februari", "Maret", "April", "Mei", "Juni",
			"Juli", "Agustus", "September", "Oktober", "November", "Desember"
		  ];
		  
		  const bulan = namaBulan[waktuSaatIni.getMonth()];
		  const tahun = waktuSaatIni.getFullYear();
		const hari = waktuSaatIni.toLocaleDateString('id-ID', { weekday: 'long' });
		const jam = waktuSaatIni.getHours().toString().padStart(2, '0');
		const menit = waktuSaatIni.getMinutes().toString().padStart(2, '0');
		let time = '';

		if (jam >= 3 && jam < 11) {
		  time = `Selamat pagi`;
		} else if (jam >= 11 && jam < 16) {
		  time = `Selamat siang`;
		} else if (jam >= 16 && jam < 18) {
		  time = `Selamat sore`;
		} else {
		  time = `Selamat malam`;
		}
		if (keywordButton) {
			await bot.reply(keywordButton.response, m.msg);
			return await buttonResponse.deleteKeyword(keywordButton.msg_id, keywordButton.keyword);
		} else if (keywordList) {
			await bot.reply(keywordList.response, m.msg);
		} else if (keywordReply) {
			await bot.reply(keywordReply.response, m.msg);
		}

		if(m.isGroupMsg){
			async function getGroupMetadata(client, from) {
				if (!client || !from) {
					throw new Error('Client dan ID grup diperlukan.');
				}
				if (!from.includes('@g.us')) {
					throw new Error('ID grup tidak valid.');
				}
				const groupMetadata = await client.groupMetadata(from);
				const metadataString = `${groupMetadata.subject}`;
				return metadataString;
			}
			const metadata = await getGroupMetadata(this.client, m.from);
			async function getGroupMetadata2(client, from) {
				if (!client || !from) {
					throw new Error('Client dan ID grup diperlukan.');
				}
				if (!from.includes('@g.us')) {
					throw new Error('ID grup tidak valid.');
				}
				
				const groupMetadata = await client.groupMetadata(from);
			
				const statusVIP = await VipGrup.getStatusVIP(from); // Panggil dengan await
				const sisaLangganan = await VipGrup.getSisaLangganan(from); // Panggil dengan await
			
				const metadataString = `*Chizuru-chan🌸*

*${groupMetadata.subject}* (${groupMetadata.id})
Status VIP: ${statusVIP}
Sisa Langganan: ${sisaLangganan}
Jumlah Member: ${groupMetadata.participants.length}

Perpanjang durasi layanan Chizu hanya di revandastore.com`;
				
				return metadataString;
			}
			
			const metadata2 = await getGroupMetadata2(this.client, m.from);
		if(await VipGrup.ceksubs(m.from)){
		

const Chizu = `*Chizuru-chan🌸*
	
どうも ありがとう ございます ~~
Iya tau, chizu cantik, makasih kak ${m.pushname}<3
ketik *menu* untuk membuka list command yaa`;

const menuChizu = `*Chizuru-chan🌸*
		
${time} kak, ada yang bisa chizu bantu?

╔══〘 *TORAM MENU* 〙══
╠➥ lvling char *miniboss/boss* [lvl]
╠➥ lvling bs *tec/non*
╠➥ lvling alche
╠➥ cari item [item]
╠➥ cari monster [monster]
╠➥ racik rumus fill 
╠➥ cari registlet [regist] 
╠➥ harga slot [eq]
╠➥ bahan tas
╠➥ bahan mq
╠➥ kode live
╠➥ info farm mats
╠➥ info dye
╠➥ info ailment 
╠➥ ninja scroll
╠➥ kalkulator quest
╠➥ buff food
╠➥ kamus besar toram
╠➥ pet lvling
╠➥ arrow elemental
╠➥ build toram
╠➥ mt terbaru
║
╠══〘 *GENERAL MENU* 〙══
╠➥ cari anime [anime]
╠➥ cari manga [manga]
╠➥ anime *top/random/recommendations*
╠➥ manga *top/random/recommendations*
╠➥ on going anime
╠➥ random anime quotes
╠➥ AI chat [pesan]
╠➥ tiktok dl [link]
╠➥ fb dl [link]
╠➥ ig dl [link]
╠➥ stikerin (reply foto)
╠➥ req fitur [pesan]
╠➥ info bot
╠➥ help
║
╠══〘 *ADMIN MENU* 〙══
╠➥ add [@628xx]
╠➥ kick [@tag member]
╠➥ promote [@tag member]
╠➥ demote [@tag member]
╠➥ anti toxic *on/off*
╠➥ anti link *on/off*
╠➥ welcome msg *on/off*
╠➥ out msg *on/off*
╠➥ grup status
║
╠═〘 *ANTI VIRTEX ON* 〙═
║>> _${hari}, ${jam}:${menit} WIB_ <<
╚═〘 *${metadata}* 〙═`;

const lvlingbs1 = `*Chizuru-chan🌸*
		
List untuk Non-Full TEC char (tanda kurung artinya minimum diff):
1-10: Shortsword (1) / Adventurer's garb (5)
8-18: Leather Armor (15)
15-35: Minotaur Knuckles (30)
35-50: Hard Knuckles (45)
50-65: Berserker Cestuses / Berserker Blade (60)
60-70: Folium Staff / Floral Lance / Phyto Blade (65)
70-90: Indigo Sword (85)
85-100: Soldier Sword (95)
100-120: Fusee Trahison (115) / Holy Robe (120)
120-140: Lightning Bolt Spear (135)
140-155: Ignis Glaive (155)
155-165: Heaven Feather Garb (160)
165-170: Red Spider Lily (165)
170-175: Indigo Jet Sword (175) / Rilevatore (175)
175-185: Bark Mail (180)
185-190: Vulture Blade / Vulture Shooter (185)
190-195: All Demon Empress Weapons (190)
195-200: Arachnid Sword (195) / Arachnid Claws (195)
200-205: Demon Empress Garb (200)
205-220: Maiden (210)
						
*Gunakan Perlengkapan DEX Untuk Meningkatkan Sedikit Difficulty*
*Gunakan Perlengkapan STR Untuk Meningkatkan Sedikit Success Rate*`;

const lvlingbs2 = `*Chizuru-chan🌸*
					
List untuk Full TEC CHAR:
1-10: Baju Pengelana
10-140: Lightning Bolt Spear/Diomeda Armor
140-185: Bark Mail
185-200: Arachnid Sword/Arachnid Claws
200-210: Maiden Armor
210-240: Trickster Armor`;

const lvlingalcheChizu = `*Chizuru-chan🌸*

List Leveling Prof Alchemist:
╔═════════════
╠➥ Lv 1-10: Revita I
╠➥ Lv 10-30: Revita II
╠➥ Lv 31-55: Revita III
╠➥ Lv 56-80: Revita IV     
╠➥ Lv 81-105: Revita V
╠➥ Lv 106-135: Revita VI
╠➥ Lv 136-240: Orichalcum 
╠➥ Lv 241+: Orichalcum Murni
╚══〘 *Chizuru Bot* 〙══
						
Tingkatan padu/lock & Prof minimum:
╔═════════════
╠➥ Lock 1: Prof Alche Lv 0
╠➥ Lock 2: Prof Alche Lv 50
╠➥ Lock 3: Prof Alche Lv 100
╠➥ Lock 4: Prof Alche Lv 150
╠➥ Lock 5: Prof Alche Lv 200
╚══〘 *Chizuru Bot* 〙══`;

const farminfoChizu = `*Chizuru-chan🌸*
		
List spot farm mats:

~ Logam
1. Bone Dragonewt (Makam Ratu Kuno: Area 1)
Monster Lv: 45
Drop: Pelat Abu-Abu
2. Malaikat Gelembung (Kuil Para Dewa: Area 2)
Monster Lv: 143
Drop: Halo Terputus, Kerikil dewa
3. Laduro (Terowongan Cobaan)
Monster Lv: 214
Drop: Mineral Cantik
	
~ Kain
1. Underground Nemico (Saluran Bawah Tanah Ultimea: Tenggara)
Monster Lv: 109
Drop: Syal Lembut
2. Potum Semedi (Koridor Heresi)
Monster Lv: 134
Drop: Celemek Robek, Sayap Nirwana
3. Laduro (Terowongan Cobaan)
Monster Lv: 214
Drop: Kain Maling

~ Kayu
1. Machina Tumbuhan (Pembuangan Peligro)
Monster Lv: 93
Drop: Kayu Terkontaminasi, Kayu Peligro
1. Ivy (Kuil Naga Kegelapan: Tengah)
Monster Lv: 208
Drop: Sulur Rambat, Batang Tebal Muda
2. Pohon Parasit (Distrik Altoale)
Monster Lv: 152
Drop: Akar Pengisap Kehidupan, Benih Gulma, Daun Kering
	
~ Fauna 
1. Bone Dragonewt (Makam Ratu Kuno: Area 1)
Monster Lv: 45
Drop: Tulang Naga
2. Underground Nemico (Saluran Bawah Tanah Ultimea: Tenggara)
Monster Lv: 109
Drop: Kuping Kelelawar
		
~ Obat 
1. Grape Jelly (Saluran Bawah Tanah Ultimea: Tenggara)
Monster Lv: 110
Drop: Agar-Agar Merah Ungu, Cairan Asam Manis

~ Mana 
1. Summershell (Item[Event Summer])
2. Laduro (Terowongan Cobaan)
Monster Lv: 214
Drop: Bola Mata Redup`;

const ninjascrollChizu = `*Chizuru-chan🌸*

"Ninja kok jadi petani?" ~Chizu

Rapid Aqua Vortex + Throwing Kunai:
THS, STAFF, BOWGUN
BOWGUN, THS, MD
BOWGUN, MD, HALBERD
BOW, OHS, KNUCKLE
BOW, KATANA, OHS
BOW, KATANA, KNUCKLE
OHS, BOW, KATANA
STAFF, THS, MD
STAFF, THS, HALBERD

Rumus lainnya:
https://toramtools.github.io/scroll.html`;

const bufffoodChizu = `*Chizuru-chan🌸*
		
Jangan lupa izin kalau mau maling (ʘᴗʘ✿)

MAX HP★		
Code: 1010032	LVL 10
Code: 1010084	LVL 10
Code: 1011945	LVL 10
Code: 1234567	LVL 10
Code: 3011143	LVL 10
Code: 7121252	LVL 9
Address: Sofya-A-420	LVL 9

MAXMP★
Code: 3204544	LVL 10
Code: 6010021	LVL 10
Code: 6070013	LVL 10
Code: 1011212	LVL 10
Code: 1016646	LVL 10
Code: 4011793	LVL 10
Code: 1010013	LVL 10
Code: 4011793	LVL 10
Code: 1011212	LVL 10

AMPR★		
Code: 1011010	LVL 10
Code: 3063101	LVL 10
Code: 1010006	LVL 10
Code: 1011010	LVL 10
Code: 1023040	LVL 10
Code: 3062728	LVL 10
Code: 1010017	LVL 10
Code: 1010092	LVL 10
Code: 5240001	LVL 10
Code: 1010050	LVL 10
Code: 1019696	LVL 10
Code: 3226325	LVL 10
Code: 5010103	LVL 10
Code: 2011111	LVL 8

CRITICAL RATE★		
Code: 1010006	LVL 10
Code: 1010092	LVL 10
Code: 1010017	LVL 10
Code: 1010050	LVL 10
Code: 1011010	LVL 10
Code: 1012000	LVL 10
Code: 7162029	LVL 10
Code: 1100000	LVL 10
Code: 1069927   LVL 10
Code: 1012000   LVL 10
Code: 3061206   LVL 9
Code: 3246969   LVL 9
Code: 7190311   LVL 9
Code: 1010011   LVL 9 

WEAPON ATK★
Code: 1010029   LVL 10
Code: 1010099   LVL 10
Code: 6010024   LVL 10
Code: 1011126   LVL 10
Code: 2020404   LVL 10
Code: 2010136   LVL 10
Code: 3070028   LVL 9
Code: 7162029   LVL 9

STR★
Code: 1110033   LVL 10
Code: 1011069   LVL 10
Code: 7031997   LVL 10 
Code: 7070777   LVL 10
Code: 4016699   LVL 10
Address: Elscaro-A-1   LVL 9

DEX★
Code: 5010092   LVL 10
Code: 1010106   LVL 10
Code: 7011001   LVL 10
Code: 2020222   LVL 10
Code: 1010058   LVL 10
Code: 4204200   LVL 8
Code: 3011143   LVL 8

INT★
Code: 2020707   LVL 10
Code: 1032222   LVL 10
Code: 6061294   LVL 10
Code: 1010489   LVL 10
Code: 6010701   LVL 10
Address: Elscaro-z-1234  LVL 8

AGI★
Code: 7162029    LVL 10
Code: 4010228    LVL 8

ACCURACY★
Code: 4261111    LVL 10
Code: 1010013    LVL 9

MAGICAL RESIST★
Code: 1010004   LVL 10
Code: 4080087   LVL 9
Code: 7227777   LVL 9

PHYSICAL RESIST★
Code: 1020001   LVL 10
Code: 1100000   LVL 10
Code: 1018989   LVL 9
Code: 1100000   LVL 9

FRACTIONAL BARRIER★
Code: 1222002   LVL 8
Code: 6181999   LVL 8

+AGGRO%★
Code: 3030110   LVL 10
Code: 1264321   LVL 10
Code: 6262000   LVL 9
Code: 1190069   LVL 9
Code: 1016646   LVL 10
Code: 1014230   LVL 9
Code: 1013000   LVL 9
Address: Sofya-A-4510 LVL 9

-AGGRO%★
Code: 1010038   LVL 10
Address: Sofya-A-2   LVL 10
Code: 3061206   LVL 8

DTE EARTH★
Code: 3210103   LVL 9
Code: 2022222   LVL 8
Code: 2020202   LVL 8
Code: 4083005   LVL 8 
Code: 2099876   LVL 7
Code: 1010174   LVL 7 
Code: 5240001   LVL 7
Code: 3011143   LVL 7
Code: 1016646   LVL 7
Code: 1010002   LVL 6

DTE WIND★
Code: 3210101   LVL 9
Code: 3030303   LVL 8
Code: 1010055   LVL 7 
Code: 4099876   LVL 7   
Code: 1010055   LVL 7

DTE WATER★
Code: 3210100   LVL 9
Code: 7150030   LVL 9
Code: 3062111   LVL 8
Code: 7011001   LVL 8
Code: 1110007   LVL 7
Code: 3226325   LVL 6

DTE FIRE★
Code: 3210106   LVL 9
Code: 7011001   LVL 8
Code: 1010799   LVL 7
Code: 1012610   LVL 5

DTE LIGHT★
Code: 3210105   LVL 9
Code: 1020345   LVL 9
Code: 4046666   LVL 8
Code: 4016699   LVL 6

DTE DARK★
Code: 3210104   LVL 9
Code: 5010092   LVL 9
Code: 6010003   LVL 8
Code: 1010006   LVL 7
Code: 1016646   LVL 7
Code: 1091111   LVL 7
Code: 3030069   LVL 7

DTE NEUTRAL★		
Code: 3210102   LVL 9
Code: 3099876   LVL 7
Code: 1011902   LVL 7
Code: 6061294   LVL 7
Code: 1019696   LVL 6
Code: 1032727   LVL 5

Drop Rate★		
Code: 4196969	LVL 6

*Mau buff kakak Chizu cantumkan disini? PM Chizu aja*`;

const kamusChizu = `*Chizuru-chan🌸*
		
Silakan dicari berdasarkan abjad

1H/OHS/P1T: Pedang 1 Tangan
2H/THS/P2T: Pedang 2 Tangan
Aggro: Ketertarikan musuh untuk menyerang kamu
AMPR: Attack MP Recovery (Bonus MP pulih pada setiap basic attack)
App: Tampilan barang
Arm: Armor (Zirah)
B): Buy (Beli)
brb: be right back (Saya akan kembali)
BS: Blacksmith/Black Shadow (Sesuai Konteks)
bwing: bird wing (sayap burung)
CF: Cross fire (skill bow)
DC: Draconic charge (skill tombak)
DT: Dragon tooth (skill tombak)
DPS: Damage per second (Pemberi damage ke musuh)
DS: Dual Sword (Pedang ganda)
DTE: Damage to element (Bonus damage jika elemen sesuai)
Dye: Pewarna barang
fb: full break (mendapatkan semua pemecahan bagian)
fk: fast kill
gtg: got to go (Saya harus pergi)
guild: Serikat
lfm: looking for member (Mencari anggota regu)
lfp: looking for party (Mencari regu)
Lock: Skill Padu Item
Mats: Poin Material (Logam, kayu, dll.)
MD: Magic Device (Pesawat Sihir)
mk: mass kill (membunuh lawan jumlah banyak)
MQ: Main Quest (Misi Utama)
NP: No Problem
Prof: Proffiency (Kemahiran)
pt: Party/Point (Sesuai Konteks)
Reff: Refine
RTE: Resist to element
S): Sell (Jual)
SH: Soul Hunter (Skill buku kegelapan)
t4: Skill lvl 4 (terbuka di lvl 150)
t5: Skill lvl 5 (Terbuka di lvl 250)
T): Trade (Barter)
thunt: treasure hunt (mencari harta karun)
typt: Thanks Party (Wajib ucapkan saat keluar regu)
UCB: Under Consignment Board (Lebih murah dari harga papan)
xcht: salah chat
Xtall: Crysta

Chat Chizuru kalau ada yang mau ditambahkan (ﾉ◕ヮ◕)ﾉ*.✧`;
const petlvlingChizu = `*Chizuru-chan🌸*

List pet leveling:
~ 1-10 Larvaca
~ 10-20 Pendekar Bertopeng: Hard
~ 20-50 Pendekar Bertopeng: NM
~ 50-100 Pendekar Bertopeng: Ulti
~ 100-120 Cerberus: Nm
~ 120-150 Cerberus: Ulti
~ 150-200 Venena Coenubia: NM
~ 200-250 Venena Coenubia: Ulti`;
const mqcalculator = `*Chizuru-chan🌸*

Tools mq calculator dapat dengan mudah diakses disini kak, terima kasih kepada master Revanda yang telah mengembangkan tools ini.
https://torampedia.my.id/tools/mq_calculator`;
const arrowChizu = `*Chizuru-chan🌸*

*API*
🔥 Panah Api (Sunion [Cermin Kegelapan])
-> Base ATK: 43 (20%)
🔥 Panah Cinta (Event Valentine)
-> Base ATK: 71 (20%) 
🔥 Panah Kaisar Iblis (Venena Metacoenubia [Neo Plastida])
-> Base ATK: 120 (10%)

*AIR*
💧 Panah Cermin Cinta (Quest Arwah Peneliti - Lv 78 [Halaman Awal Mula])
-> Base ATK: 37 (20%)
💧 Panah Tangis Langit (Floragonet [Distrik Fractum: Area 1])
-> Base ATK: 84 (20%)
💧 Panah Samudra (Event Summer)
-> Base ATK: 110 (10%)

*ANGIN*
🌪️ Panah Topan (Forestia [Tanah Kaos])
-> Base ATK: 12 (15%)
🌪️ Panah Apel (Coryn [Distrik Dikkit])
-> Base ATK: 92 (15%)
🌪️ Panah Ratu Lebah (Event Valentine)
-> Base Atk : 150 (20%)

*BUMI*
🌏 Pointed Ore Arrow (Tikus Gua [Reruntuhan Singolare : Lantai 1])
-> Base ATK: 43 (20%)
🌏 Panah Cacao (Event Valentine)
-> Base ATK: 50 (20%)
🌏 Guardian Forest Arrow (Arbogazella [Guardian Forest: Lost Woods])
-> Base ATK: 163 (20%)

*GELAP*
🖤 Panah Duri (Ivy [Kuil Naga Kegelapan: Bawah])
-> Base ATK: 79 (20%)
🖤 Panah Sakura Senja (Amalgam [Event Hanami])
-> Base ATK: 100 (20%)
🖤 Specter Arrow (Manomare [Event Halloween])
-> Base ATK: 120 (20%)

*CAHAYA*
⚡ Flash Volt (Quest Npc Juan - Lvl68 [El Scaro])
-> Base ATK: 3 (15%)
⚡ Panah Seni Permen (Event White Day)
-> Base ATK: 56 (20%)
⚡ Panah Pohon Suci (Santabby [Event Natal])
-> Base ATK: 100 (20%)

*NETRAL*
⚪ Dreamy Arrow (Dreamy Scarlet Sakura [Hanami Event])
-> Base ATK: 136 (20%)
⚪ Driver Bolt (Inspector Golem [Event Natal])
-> Base ATK: 200 (20%)`;
const loading = `*Chizuru-chan🌸*

Sedang mengambil data...`;
const buildChizu = `*Chizuru-chan🌸*

Build disini hanya sekedar referensi. Semua skill, combo, regislet, dan eq, menyesuaikan dengan playstyle.
Build pribadi by: R e v a n d a
Jenis: Tier 5 Build (Lv 280)
https://drive.google.com/drive/folders/1CtXe-jDXEfsrpSwvrDbfBaA5un6X00ge`;

const url = 'https://id.toram.jp/?type_code=update';
const scrapeCategory = async () => {
	try {
	const response = await axios.get(url);
	const html = response.data;
	const $ = cheerio.load(html);
	const newsList = [];
	$('li.news_border').each((index, element) => {
		const title = $(element).find('.news_title').text();
		const link = $(element).find('a').attr('href');
		newsList.push({ title, link });
	});
	return newsList;
	} catch (error) {
	console.error('Terjadi kesalahan:', error.message);
	}
};

const scrapeLatestNews = async (newsUrl) => {
	try {
		const response = await axios.get(newsUrl);
		const html = response.data;
		const $ = cheerio.load(html);
	
		const title = $('.smallTitle.news_title.yellow').text().trim();
		const content = $('div.useBox')
		.clone() // Duplikat elemen div.useBox untuk menghindari perubahan pada elemen aslinya
		.find('a, p, h1, script') // Cari semua elemen yang mengandung tag <a>
		.remove() // Hapus elemen-elemen tersebut
		.end()
		.text() // Ambil teks dari elemen tersebut
		.trim();;
		// Kembalikan berita terbaru
		return { title, content };
	} catch (error) {
		console.error('Terjadi kesalahan:', error.message);
		return null;
	}
	};  
	// Contoh penggunaan
	const scrapeData = async () => {
	const newsList = await scrapeCategory();
	if (newsList.length > 0) {
		const latestNewsUrl = newsList[0].link; // Ambil tautan berita terbaru
		const latestNews = await scrapeLatestNews('https://id.toram.jp/'+latestNewsUrl);
		if (latestNews) {
		return(
`*Chizuru-chan🌸*

${latestNews.title}
══════════════
${latestNews.content}
══════════════`);
		}
	}
	};

	const rawlv = m.body.split(" ")[3];
	let typem = '';
	if (m.body.split(" ")[2] === "boss") {
	typem = "3";
	} else if (m.body.split(" ")[2] === "miniboss") {
	typem = "2";
	}
	
	const levelingfunc = async () => {
	const token = "17|2bjIThBL1nVrE8fDjPTygHbp8GtTyuTO8NMdmsmx";
	const auth = { headers: { Authorization: `Bearer ${token}` } };
	
	try {
		const response = await axios.get(`https://toram-id.com/api/v1/monsters/${typem}?level=${rawlv}&bonusexp=0&between=9`, auth);
		const users = response.data.data.slice(0, 10);
		const sorted = users.sort((elem1, elem2) => elem2.xp - elem1.xp);
return `*Chizuru-chan🌸*

Siap tuan, sesuai permintaan<3
╔═════════════
${sorted.map((RawData) => bosstemplate(RawData, rawlv)).join("\n")}
╚══〘 *${metadata}* 〙══`;
	} catch (error) {
		console.error('Terjadi kesalahan:', error.message);
		return 'Terjadi kesalahan dalam pencarian.';
	}
	};
	
	// Fungsi untuk menghitung bonus XP
	function bonusexp(xp, PlayerLv, BossLv) {
	if (BossLv <= PlayerLv + 5 && PlayerLv - 5 <= BossLv) {
		return `${xp * 11}` ;
	} else if (BossLv <= PlayerLv + 6 && PlayerLv - 6 <= BossLv) {
		return `${xp * 10}` ;
	} else if (BossLv <= PlayerLv + 7 && PlayerLv - 7 <= BossLv) {
		return `${xp * 9}` ;
	} else if (BossLv <= PlayerLv + 8 && PlayerLv - 8 <= BossLv) {
		return `${xp * 7}` ;
	} else if (BossLv <= PlayerLv + 9 && PlayerLv - 9 <= BossLv) {
		return `${xp * 3}` ;
	} else {
		return `${xp}`;
	}
}
function bosstemplate(RawData, rawlv) {
	return (`╠➥ *${RawData.name}*
║ Level: ${RawData.level}
║ EXP: ${bonusexp(RawData.xp, rawlv, RawData.level)}
║ HP: ${RawData.hp}
║ 📌 ${RawData.map.name}`);
};

	const lvlingCharRegex = /^lvling char (\w+) (\d+)$/i;
	const match = m.body.match(lvlingCharRegex);
	const antiToxicRegex = /^anti toxic (on|off)$/i;
	const matchAntiToxic = m.body.match(antiToxicRegex);
	const antiLinkRegex = /^anti link (on|off)$/i;
	const matchAntiLink = m.body.match(antiLinkRegex);
	const welcomeRegex = /^welcome msg (on|off)$/i;
	const matchWelcome = m.body.match(welcomeRegex);
	const outRegex = /^out msg (on|off)$/i;
	const matchOut = m.body.match(outRegex);
	const KickRegex = /^kick (\S+)$/i;
	const kick = m.body.match(KickRegex);
	const AddRegex = /^add (\S+)$/i;
	const invite = m.body.match(AddRegex);
	const PromoteRegex = /^promote (\S+)$/i;
	const promote = m.body.match(PromoteRegex);
	const DemoteRegex = /^demote (\S+)$/i;
	const demote = m.body.match(DemoteRegex);
	const SearchMonsterRegex = /^cari monster (.+)$/i;
	const searchmonster = m.body.match(SearchMonsterRegex);
	const SearchItemRegex = /^cari item (.+)$/i;
	const searchitem = m.body.match(SearchItemRegex);
	const AIChatRegex = /^AI chat (.+)$/i;
	const chatai = m.body.match(AIChatRegex);
	const ReqfiturRegex = /^req fitur (.+)$/i;
	const reqfitur = m.body.match(ReqfiturRegex);
	const wpotRegex = /^Weapon pot:\s*(\d+)/i;
	const matchPot1 = m.body.match(wpotRegex);
	const apotRegex = /^Armor pot:\s*(\d+)/i;
	const matchPot2 = m.body.match(apotRegex);
	const tiktokRegex = /^tiktok dl (.+)$/i;
	const tiktokdl = m.body.match(tiktokRegex);
	const fbRegex = /^fb dl (.+)$/i;
	const fb = m.body.match(fbRegex);
	const igRegex = /^ig dl (.+)$/i;
	const ig = m.body.match(igRegex);
	const registRegex = /^cari registlet (.+)$/i;
	const regist = m.body.match(registRegex);
	const animeRegex = /^cari anime (.+)$/i;
	const anime = m.body.match(animeRegex);
	const mangaRegex = /^cari manga (.+)$/i;
	const manga = m.body.match(mangaRegex);
	const animeRegex2 = /^anime (top|random|recommendations)$/i;
	const anime2 = m.body.match(animeRegex2);
	const mangaRegex2 = /^manga (top|random|recommendations)$/i;
	const manga2 = m.body.match(mangaRegex2);
	const regex = new RegExp(`\\b(${badwords.join('|')})\\b`, 'gi');


const infobot =`*Chizuru-chan🌸*

Create with love by Revanda,
Bot ini dibuat untuk membantumu dalam mencari informasi seputar Toram Online.
Bot ini masih terus dikembangkan, jadi mohon maaf jika masih ada beberapa fitur yang belum berjalan dengan baik.
Jika kamu memiliki saran atau pertanyaan, silakan chat Chizuru-chan.
Terima kasih sudah menggunakan Chizuru-chan🌸

Katalog bot: https://revandastore.com/katalog/11
Owner Chizuru: https://github.com/yogadev1990`;

const bagupgrade =`*Chizuru-chan🌸*

¤ 50-51
- Kulit Colon x1 (Colon; Tanah Pembangunan)
¤ 51-52
- Kulit Berkualitas x1 (Lavarca; Dataran Rakau)
¤ 52-53
- Spina x1.000
¤ 53-54
- Kulit Minotaur x1 (Minotaur; Kuil Runtuh: Area Terlarang)
- Pecahan Kristal Jingga x1 (Cobre; Danau Icule)
¤ 54-55
- Kulit Anjing Hutan x1 (Anjing Hutan; Hutan Marbabo: Bagian Dalam)
- Lencana Goblin x1 (Boss Goblin; Gua Ribisco: Bagian Dalam)
¤ 55-56
- Spina x2.000
¤ 56-57
- Bulu Mochelo x1 (Mochelo; Lereng Merapi A3)
- Kain Linen x10 (Crow Killer; Dusun Douce)
¤ 57-58
- Bulu Naga Giok x1 (Forestia; Tanah Kaos)
- Tanduk Berkualitas x10 (Bandot; Tanah Tinggi Yorl)
¤ 58-59
- Sabuk Bos Roga x1 (Boss Roga; Gua Bawah Tanah Saham: Ujung)
- Kain Beludu x10 (Orc Petarung; Gua Bawah Tanah Saham)
¤ 59-60
- Spina x4.000
¤ 60-61
- Cakar Beruang x2 (Violaccoon; Padang Darkanon)
- Sheeting Fabric x20 (Cassy; Makam Ratu Kuno: Area 2)
¤ 61-62
- Rantai Kukuh x2 (Pendekar Bertopeng; Tanah Tinggi Pertanian)
- Kain Polister x20 (Boneka Pengembara; Kota Hilang)
¤ 62-63
- Sisik Naga Sabana x2 (Naga Sabana Yelb; Desa Albatif)
- Kulit Serigala Alien x20 (Serigala Luar; Gerbang Dunia Lain: Area 1)
¤ 63-64
- Spina x8.000
¤ 64-65
- Jubah Sobek x2 (Goovua; Gurun Akaku: Bukit)
- Kulit Tupai x20 (Rodentail; Maia Diela)
¤ 65-66
- Tanduk Elang Zamrud x2 (Elang Zamrud; Teras Kerikil)
- Bulu Kambing x20 (Koza; Jurang Dunkel)
¤ 66-67
- Sayap Naga Senja x2 (Naga Senja; Benteng Solfini: Atap)
- Bulu Halus x20 (Little Snow Boar; Lembah Es Polde)
¤ 67-68
- Spina x16.000
¤ 68-69
- Rantai Penyucian x2 (Cerberus; Mata Air Kelahiran: Puncak)
- Kain Goyah x20 (Jewel Eye; Mata Air Kelahiran: Tengah)
¤ 69-70
- Benang Aranea x2 (Aranea; Taman Sublimasi: Pusat)
- Benang Laba-Laba Kecil x20 (Aramia; Taman Sublimasi: Area 2)
¤ 70-71
- Kain Dewi Tiruan x3 (Imitacia; Istana Gelap: Aula Besar)
- Kain Apung x10 (Flying Executioner; Buaian Prajurit)
- Tapak Lembut x20 (Bunny Summoner; Sungai Kegelapan)
¤ 71-72
- Surai Hewan Iblis x3 (Memecoleous; Istana Gelap: Area2)
- Bantalan Tapak Keras x10 (Manticore; Istana Gelap: Area1)
- Bulu Bayangan Hitam x20 (Shadow Fly; Istana Gelap: Area1)
¤ 72-73
- Spina 32.000
¤ 73-74
- Bulu Tapir x3 (Tapir; Graben Membara: Permukaan)
- Bulu Kaku x10 (Wooly; Graben Membara: Permukaan)
- Minyak Anti Karat x20 (Ornis Demi Machina; Garis Pertahanan Artileri Otomatis)
¤ 74-75
- Kain Kuno x3 (Proto Leon; Reruntuhan Singolaire: Lantai 3)
- Kulit Pohon Lunak x10 (Floral Bee; Situs Simcracker)
- Rambut Potum Kotor x20 (Slum Potum; Klaspe Kumuh)
¤ 75-76
- Tulang Raksasa Merah x3 (Dusk Machina; Pabrik Demi Machina Kecil: Area 2)
- Mantel Hitam Sobek x10 (Rugos Demi Machina; Pabrik Demi Machina Kecil: Area 2)
- Rantai Putus x20 (Machina Penyiksa; Pabrik Demi Machina Kecil: Area 2)
¤ 76-77
- Sisik Chimera x3 (Mozto Machina; Pabrik Demi Machina Besar: Bagian Terdalam)
- Benda Pendar Aneh x10 (Horn Machina; Pabrik Demi Machina Besar)
- Tentakel Tangguh x20 (Ledon Machina; Pabrik Demi Machina Besar)
¤ 77-78
- Spina x64.000
¤ 78-79
- Jubah Roh Hutan x3 (Lalvada; Hutan Monster: Bagian Dalam)
- Taring Tanaman x10 (Nepenthe; Hutan Monster)
- Kain Felt x20 (Naga Boneka; Mansion Lufenas)
¤ 79-80
- Aloi Lyark x3 (Gwaimol; Penjara Cuervo: Atap)
- Baju Penjaga Robek x10 (Sipir Lyark; Penjara Cuervo: Lantai 2)
- Kain Lembu x20 (Lyark Spesialis; Laboratorium Brahe: Area 2)
¤ 80-81
- Kain Bercahaya x4 (Seraph Machina: Menara Penembus Bumi: Sisi Dalam)
- Kulit Sintetis Rusak x20 (Lyark Brawler: Sekitar Alun-Alun Droma)
- Cawat Pengeksekusi x20 (Volo: Sekitar Alun-Alun Droma Area 2)
¤ 81-82
- Potongan Baju K. Kecil x4 (Venena: Istana Ultimea: Takhta)
- Pecahan Zirah Keras x20 (High Tigris: Istana Ultimea Gudang Demi Machina)
- Kulit Ular x20 (Ular Kolam: Reservoir Copia)
¤ 82-83
- Spina x100.000
¤ 83-84
- Kulit Mama Fluck x4 (Mama Fluck: Gua Pelupa)
- Daun Besar Colon x20 (Leedle Colon: Dataran Rokoko)
- Bulu Garis Vertikal x20 (Rakun Tambun: Hutan Curonne)
¤ 84-85
- Kain Rohani Mardula x4 (Mardula: Serambi Dewa Berkah)
- Kain Berkilau Misterius x20 (Malaikat Gelembung: Koridor Heresi/Kuil Para Dewa/Serambi Dewa Pembangunan/Serambi Dewa Istimewa)
- Bulu Kelabu x20 (Haliabubo: Reruntuhan G. Mithurna: Koridor Atas)
¤ 85-86
- Mantel Carbuncle x4 (Carbuncle: Serambi Dewa Pembangunan)
- Kain Rajut x20 (Malaikat Gelembung: Koridor Heresi)
- Ekor Beruang Berkantong x20 (Oddy: Kuil Para Dewa: Area 4/Serambi Dewa Pembangunan)
¤ 86-87
- Bulu Raja Piton x4 (Raja Piton: Pegunungan Elf: Kuil)
- Bulu Putih Lebat x20 (Bandot: Taman Es &Salju)
- Bulu Abu Kaku x20 (Silveria: Pegunungan Elf)
¤ 87-88
- Ingot Kuno x4 (Golem Preman: Kuil Naga Kegelapan: Tengah)
- Taring Serigala Es x20 (Corloup: Pegunungan Elf)
- Kain Gelap x20 (Soul Reaper: Kuil Naga Kegelapan)
¤ 88-89
- Spina x200.000
¤ 89-90
- Taring Tuscog x4 (Tuscog: Jalan Eryldan: Sekitar Hutan Ein)
- Sutra Ulat x20 (Tikus Lumut: Hutan Ein)
- Bulu Manusia Serigala x20 (Wolfret: Jalan Eryldan)
¤ 90-91
- Serpihan Kayu Kuzto x5 (Kuzto; Distrik Labilans: Alun-Alun)
- Bulu Cerpelai x20 (Satwal; Distrik Fabriska)
- Sabuk Pinggang Misterius x30 (Moculus; Distrik Fractum: Area 1)
¤ 91-92
- Kantong Kristal x5 (Nemopirania; Distrik Racetacula: Area 1)
- Ekor Lembut x20 (Alpoca; Distrik Labiland)
- Papula Kuat x30 (Toksinaria; Distrik Racetacula: Area 1)
¤ 92-93
- Sayap Repthon x5 (Repthon; Zona Riset Delzton: Area Terdalam)
- Kancing Polong x20 (Colon Marquis; Reruntuhan Mansion Lufenas Tua)
- Kain Perca Jas Panjang x30 (Gulingkar; Zona Riset Delzton: Area 1)
¤ 93-94
- Rambut Kaisar Siluman x5 (Venena Metacoenubia; Neo Plastida)
- Kain Merah Sobek x20 (Potum Bandit Gurun; Gurun Pasir Geist: Area 1) 
- Kulit Karatan x30 (Jasman; Reruntuhan Elban Urban)
¤ 94-95
- Spina x300.000
¤ 95-96
- Tulang Pisteus x5 (Pisteus; Pesisir Ducia: Area Terdalam)
- Kain Phantom x20 (Flooray; Dasar Tebing Lunagent)
- Bulu Berang-Berang Laut x30 (Lutris; Pesisir Ducia: Area 3)
¤ 96-97
- Sayap Arachnidemon x5 (Arachnidemon; Lembah Arche: Area Terdalam)
- Belenggu Logam x20 (Besy; Lembah Arche)
- Kulit Ular Aneh x30 (Coofer; Reruntuhan Kota Rokoko)
¤ 97-98
- Jangat Berlendir x5 (Datuk Nezim; Lahan Basah Nezim)
- Kain Enty x20 (Enty; Rimba Penyihir)
- Poros Kokoh x30 (Orang2an Sawah Seram; Rimba Penyihir: Area 2)
¤ 98-99
- Perca Gendam Geni x5 (Hexter; Rimba Penyihir: Area Terdalam)
- Piring Kappa x20 (Kappadon; Lahan Basah Nezim)
- Bulu Gagak x30 (Orang2an Sawah Seram; Rimba Penyihir: Area 2)
¤ 99-100
- Inti Latebra Menggeliat x5 (Trocostida; Nov Diela: Area 1)
- Cairan Lekat x20 (Juvestida; Nov Diela: Area 1)
- Kulit Pelik x30 (Mata Jahat; Padang Morga: Area 1)`;

const codelive =`*Chizuru-chan🌸*

*Kode Reward Live Streaming*
Tanggal : 20 Mei 2024
Kode : dl1400man
Tipe Chat : Ucap
Lokasi : Pakar Padu Kota Sofya
Limit : 13.59 WIB
Hadiah :
- 100x Pecahan Orb
- 3x Life Potion`;

async function animesearch(query) {
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}&sfw`);
        const result = response.data.data;

        let animeDetails = `*Chizuru-chan🌸*\n\n`;

        result.forEach((anime, index) => {
            const title = anime.title;
            const releaseDate = new Date(anime.aired.from).toLocaleDateString();
            const episodes = anime.episodes;
            const url = anime.url;

            animeDetails += `*${index + 1}. ${title}*\n`;
            animeDetails += `_Tanggal Rilis:_ ${releaseDate}\n`;
            animeDetails += `_Jumlah Episode:_ ${episodes}\n`;
            animeDetails += `_Sumber:_ ${url}\n\n`;
        });

        return animeDetails;
    } catch (error) {
        console.error('Terjadi kesalahan:', error.message);
        return 'Terjadi kesalahan dalam pencarian.';
    }
}
async function mangasearch(query) {
    try {
        const response = await axios.get(`https://api.jikan.moe/v4/manga?q=${query}&sfw`);
        const mangaList = response.data.data;

        let mangaDetails = `*Daftar Manga*\n\n`;

        mangaList.forEach((manga, index) => {
            const title = manga.title;
            const type = manga.type;
            const status = manga.status;
            const synopsis = manga.synopsis;

            mangaDetails += `*${index + 1}. ${title}*\n`;
            mangaDetails += `_Tipe:_ ${type}\n`;
            mangaDetails += `_Status:_ ${status}\n`;
            mangaDetails += `_Sinopsis:_ ${synopsis}\n\n`;
        });

        return mangaDetails;
    } catch (error) {
        console.error('Terjadi kesalahan:', error.message);
        return 'Terjadi kesalahan dalam pencarian manga.';
    }
}

async function animesearch2(query) {
	try {
		const response = await axios.get(`https://api.jikan.moe/v4/${query}/anime`);
		let animeDetails = `*Chizuru-chan🌸*\n`;
  
		if (query === 'top') {
			const anim = response.data.data;
			anim.forEach((anime, index) => {
				const title = anime.title;
				const releaseDate = new Date(anime.aired.from).toLocaleDateString();
				const episodes = anime.episodes;
				const trailerUrl = anime.trailer.url;
  
				animeDetails += `\n*${index + 1}. ${title}*\n`;
				animeDetails += `_Tanggal Rilis:_ ${releaseDate}\n`;
				animeDetails += `_Jumlah Episode:_ ${episodes}\n`;
				animeDetails += `_Trailer:_ ${trailerUrl}\n`;
			});
		} else if (query === 'recommendations') {
	  const recommendations = response.data.data;
			  recommendations.slice(0, 15).forEach(recommendation => {
				const recommender = recommendation.user.username; // Nama orang yang merekomendasikan
				  recommendation.entry.forEach(anime => {
					const title = anime.title; // Judul anime
					const url = anime.url; // URL anime
	
					animeDetails += `\n*Direkomendasikan oleh:* ${recommender}\n`;
					animeDetails += `[${title}](${url})\n`;
				});
			});
		} else if (query === 'random') {
		  const animeData = response.data.data;
  
		  animeDetails += `
*Judul:* ${animeData.title}
*Genre:* ${animeData.genres.map(genre => genre.name).join(', ')}
*Tipe:* ${animeData.type}
*Studio:* ${animeData.studios.map(studio => studio.name).join(', ')}
*Jumlah Episode:* ${animeData.episodes}
*Status:* ${animeData.status}
*Tanggal Penayangan:* ${animeData.aired.string}
*Durasi:* ${animeData.duration}
*Rating:* ${animeData.rating}
*Peringkat:* #${animeData.rank}
*Popularitas:* #${animeData.popularity}
*Link:* ${animeData.url}
*Sinopsis:*
${animeData.synopsis}`;
		}
  
		return animeDetails;
	} catch (error) {
		console.error('Terjadi kesalahan:', error.message);
		return 'Terjadi kesalahan dalam pencarian.';
	}
  }

  async function mangasearch2(query) {
	try {
		const response = await axios.get(`https://api.jikan.moe/v4/${query}/manga`);
		let mangaDetails = `*Daftar Manga*\n`;
  
		if (query === 'top') {
			const mangaList = response.data.data;
				mangaList.forEach((manga, index) => {
		  const title = manga.title;
		  const type = manga.type;
		  const status = manga.status;
		  const synopsis = manga.synopsis;
		  const link = manga.url;
	
		  mangaDetails += `\n*${index + 1}. ${title}*\n`;
		  mangaDetails += `_Tipe:_ ${type}\n`;
		  mangaDetails += `_Status:_ ${status}\n`;
		  mangaDetails += `_Link:_ ${link}\n`;
		  mangaDetails += `_Sinopsis:_ ${synopsis}\n`;
		});
		} else if (query === 'recommendations') {
		  const recommendations = response.data.data;
				recommendations.slice(0, 15).forEach(recommendation => {
				  const recommender = recommendation.user.username;
					recommendation.entry.forEach(anime => {
					  const title = anime.title;
					  const url = anime.url;
	  
					  mangaDetails += `\n*Direkomendasikan oleh:* ${recommender}\n`;
					  mangaDetails += `[${title}](${url})\n`;
				  });
			  });
		} else if (query === 'random') {
		  const animeData = response.data.data;
	
		  mangaDetails += `
*Judul:* ${animeData.title}
*Genre:* ${animeData.genres.map(genre => genre.name).join(', ')}
*Author:* ${animeData.authors.map(author => author.name).join(', ')}
*Tipe:* ${animeData.type}
*Volume:* ${animeData.volumes}
*Jumlah Chapter:* ${animeData.chapters}
*Status:* ${animeData.status}
*Tanggal Publikasi:* ${animeData.published.string}
*Peringkat:* #${animeData.rank}
*Popularitas:* #${animeData.popularity}
*Link:* ${animeData.url}
*Sinopsis:*
${animeData.synopsis}`;
		}
  
		return mangaDetails;
	} catch (error) {
		console.error('Terjadi kesalahan:', error.message);
		return 'Terjadi kesalahan dalam pencarian.';
	}
  }


const ongoingnime = async () => {
    try {
        const response = await axios.get('https://api.jikan.moe/v4/seasons/now');
        const ongoingAnime = response.data.data;

        let animeDetails = `*Chizuru-chan🌸*\n\n`;

        ongoingAnime.forEach((anime, index) => {
            const title = anime.title;
            const releaseDate = new Date(anime.aired.from).toLocaleDateString();
            const episodes = anime.episodes;
            const trailerUrl = anime.trailer.url;

            animeDetails += `*${index + 1}. ${title}*\n`;
            animeDetails += `_Tanggal Rilis:_ ${releaseDate}\n`;
            animeDetails += `_Jumlah Episode:_ ${episodes}\n`;
            animeDetails += `_Trailer:_ ${trailerUrl}\n\n`;
        });

        return animeDetails;
    } catch (error) {
        console.error('Terjadi kesalahan:', error.message);
        return 'Terjadi kesalahan dalam pencarian.';
    }
};


const randomquotesnime = async () => {
	try {
		const response = await axios.get(`https://katanime.vercel.app/api/getrandom`);
		const quotes = response.data.result;
		const formattedQuotes = quotes.map(quote => {
			return `_"${quote.indo}"_   
*~${quote.character} (${quote.anime})*
`;
		});
		return `*Chizuru-chan🌸*
		
${formattedQuotes.join("\n")}`;
	} catch (error) {
		console.error('Terjadi kesalahan:', error.message);
		return 'Terjadi kesalahan dalam pencarian.';
	}
};

const itemsearch = async (query) => {
    const token = "17|2bjIThBL1nVrE8fDjPTygHbp8GtTyuTO8NMdmsmx";
    const auth = { headers: { Authorization: `Bearer ${token}` } };

    try {
        const response = await axios.get(`https://toram-id.com/api/v1/items/search/${query}`, auth);
        const items = response.data.data;
        
        let itemDetails = `*Chizuru-chan🌸*\n`;

        items.forEach(item => {
                const itemName = item.name;
				const itemLink = item.id;
                const itemStat = item.note && item.note.monster ? item.note.monster : 'Tidak ada informasi stat';
                const itemType = item.drop_type && item.drop_type.name ? item.drop_type.name : 'Tidak ada informasi tipe';

                const monsterList = item.monsters.map(monster => {
                    return `• ${monster.name} (${monster.map_id})`;
                }).join('\n');

                itemDetails += `\n*Nama* ${itemName}\n`;
                itemDetails += `*Stat:* ${itemStat}\n`;
                itemDetails += `*Type:* ${itemType}\n`;
                itemDetails += `*Drop dari:*\n${monsterList}\n`;
				itemDetails += `*Link:* https://toram-id.com/item/${itemLink}\n`;
        });

        return itemDetails;
    } catch (error) {
        console.error('Error fetching item data:', error.message);
        return 'Terjadi kesalahan dalam pencarian item.';
    }
}

const monstersearch = async (query) => {
    const token = "17|2bjIThBL1nVrE8fDjPTygHbp8GtTyuTO8NMdmsmx";
    const auth = { headers: { Authorization: `Bearer ${token}` } };

    try {
        const response = await axios.get(`https://toram-id.com/api/v1/monsters/search/${query}`, auth);
        const monsters = response.data.data;
        
        let monsterDetails = `*Chizuru-chan🌸*\n`;

        monsters.forEach(monster => {
            const name = monster.name;
            const level = monster.level;
			const element = monster.element.name;
            const exp = monster.xp;
            const hp = monster.hp;
			const link = monster.id;
            const location = monster.map.name;

            const drops = monster.drops.map(drop => {
                return `• ${drop.name} (${drop.drop_type.name})`;
            }).join('\n');

            monsterDetails += `\n*Nama:* ${name}\n`;
            monsterDetails += `*Level:* ${level}\n`;
			monsterDetails += `*Elemen:* ${element}\n`;
            monsterDetails += `*Base Exp:* ${exp}\n`;
            monsterDetails += `*HP:* ${hp}\n`;
            monsterDetails += `*Lokasi:* ${location}\n`;
            monsterDetails += `*Drops:*\n${drops}\n`;
			monsterDetails += `*Link:* https://toram-id.com/monster/${link}\n`;
        });

        return monsterDetails;
    } catch (error) {
        console.error('Error fetching monster data:', error.message);
        return 'Terjadi kesalahan dalam pencarian monster.';
    }
}

const priceknuck =`*Chizuru-chan🌸*

Prime Knuck (1-2 Knuck): 20m
Piercer Knuck (0-1 Knuck): 5m

PM chizu bila harga berubah kak^^`;

const pricestf =`*Chizuru-chan🌸*

Prime Staff (1-2 Staff): 20m
Piercer Staff (0-1 Staff): 5m

PM chizu bila harga berubah kak^^`;

const pricemd =`*Chizuru-chan🌸*

Prime MD (1-2 MD): 20m
Piercer MD (0-1 MD): 5m

PM chizu bila harga berubah kak^^`;

const priceohs =`*Chizuru-chan🌸*

Prime OHS (1-2 OHS): 20m
Piercer OHS (0-1 OHS): 5m

PM chizu bila harga berubah kak^^`;

const priceths =`*Chizuru-chan🌸*

Prime THS (1-2 THS): 20m
Piercer THS (0-1 THS): 5m

PM chizu bila harga berubah kak^^`;

const pricebow =`*Chizuru-chan🌸*

Prime Bow (1-2 Bow): 20m
Piercer Bow (0-1 Bow): 5m

PM chizu bila harga berubah kak^^`;

const pricebwg =`*Chizuru-chan🌸*

Prime Bowgun (1-2 Bowgun): 20m
Piercer Bowgun (0-1 Bowgun): 5m

PM chizu bila harga berubah kak^^`;

const pricehb =`*Chizuru-chan🌸*

Prime Halberd (1-2 Halberd): 20m
Piercer Halberd (0-1 Halberd): 5m

PM chizu bila harga berubah kak^^`;

const pricektn =`*Chizuru-chan🌸*

Prime Katana (1-2 Katana): 20m
Piercer Katana (0-1 Katana): 5m

PM chizu bila harga berubah kak^^`;

const pricearm =`*Chizuru-chan🌸*

Legendary Neddle (1-2 Armor): 20m
Neddle (0-1 Armor): 5m

PM chizu bila harga berubah kak^^`;

const priceadd =`*Chizuru-chan🌸*

Legendary Silk (1-2 Additional): 300M-350M
Silk (0-1 Additional): 5m

PM chizu bila harga berubah kak^^`;

const pricering =`*Chizuru-chan🌸*

Legendary Ornament (1-2 Ring): 20m
Ornament (0-1 Ring): 5m

PM chizu bila harga berubah kak^^`;

const bahanmq =`*Chizuru-chan🌸*

List bahan MQ:
- Sisik naga, Hard Dragon Skin (2pcs)
- Daging domba, Lamb Meat (1pcs)
- Sulur, Vine (3pcs)
- Paruh tebal, Thick Beak (3pcs)
- Sayap peri, Fairy Feather (3pcs)
- Koin ksatria, Swordsman Stone Coin (20pcs)
- Kulit kodok pasir, Sand Frog Skin (5pcs)
- Cakar binatang buas, Beast Claw (3pcs)
- Daging tikus pasir, Sand Mole Meat (1pcs)
- Taring bergerigi, Jagged Fang (10pcs)
- Kristal saham, Saham Crystal (5pcs)
- Permata jiwa, Spiritual Gemstone (1pcs)
- Anggur rokoko, Rokoko grape (5pcs)
- Kayu labilan, Labilan Woods (10pcs)
- Tanduk Patah, Broken Horn (20pcs)
- Bijih Berkembang, Growing Ore (5pcs)
- Batu Jabali, Jabali Stone (5pcs)`;
async function tiktok(url) {
    try {
        const response = await axios.get("https://ttdownloader.com/", {
            headers: {
                cookie: "PHPSESSID=9ut8phujrprrmll6oc3bist01t; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061",
            },
        });
        
        const $ = cheerio.load(response.data);
        const token = $("#token").attr("value");
        const config = {
            url: url,
            format: "",
            token: token,
        };
        
        const response2 = await axios.post("https://ttdownloader.com/search/", new URLSearchParams(Object.entries(config)), {
            headers: {
                cookie: "PHPSESSID=9ut8phujrprrmll6oc3bist01t; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061",
            },
        });

        const $2 = cheerio.load(response2.data);
        const nowm = await turl.shorten($2("div:nth-child(2) > div.download > a").attr("href"));
        const wm = await turl.shorten($2("div:nth-child(3) > div.download > a").attr("href"));

        return { nowm, wm };
    } catch (error) {
        console.error(error);
        throw error;
    }
}
async function instagram(url) {
	try {
	  const params = new URLSearchParams();
	  params.append('q', url);
	  params.append('recaptchaToken', '');
	  params.append('lang', 'en');
	  params.append('t', 'media');
  
	  const response = await axios.post('https://v3.igdownloader.app/api/ajaxSearch', params, {
		headers: {
		  "authority": "v3.igdownloader.app",
		  "Accept": "*/*",
		  "Accept-Language": "en-US,en;q=0.9,id;q=0.8,ar;q=0.7,ms;q=0.6",
		  "Content-Length": "121",
		  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		  "Origin": "https://igdownloader.app",
		  "Priority": "u=1, i",
		  "Referer": "https://igdownloader.app/",
		  "Sec-Ch-Ua": "\"Chromium\";v=\"124\", \"Microsoft Edge\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
		  "Sec-Ch-Ua-Mobile": "?0",
		  "Sec-Fetch-Dest": "empty",
		  "Sec-Fetch-Site": "same-site",
		  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0"
		},
	  });
	  const $ = cheerio.load(response.data.data);
	  const downloadLinks = {
		 link: await turl.shorten($("a.abutton").attr("href"))
	  };
  
	  return downloadLinks;
	} catch (error) {
	  console.error(error);
	  throw error;
	}
  }
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function fillstatw(message) {
	 const statRegex = /([A-Z]+%?)\s+(-?\d+)/ig;
	 const statTranslate = {
		 "A%": "ATK+%25",
		 "A": "ATK",
		 "M%": "MATK+%25",
		 "M": "MATK",
		 "S%": "STR+%25",
		 "S": "STR",
		 "D%": "DEX+%25",
		 "D": "DEX",
		 "I%": "INT+%25",
		 "I": "INT",
		 "V%": "VIT+%25",
		 "V": "VIT",
		 "AG%": "AGI+%25",
		 "AG": "AGI",
		 "CD%": "Critical+Damage+%25",
		 "CD": "Critical+Damage",
		 "CR%": "Critical+Rate+%25",
		 "CR": "Critical+Rate",
		 "DTF%": "%25+luka+ke+Api",
		 "DTE%": "%25+luka+ke+Bumi",
		 "DTW%": "%25+luka+ke+Air",
		 "DTA%": "%25+luka+ke+Angin",
		 "DTL%": "%25+luka+ke+Cahaya",
		 "DTD%": "%25+luka+ke+Gelap",
		 "ASPD": "Kecepatan+Serangan",
		 "ASPD%": "Kecepatan+Serangan+%25",
		 "CSPD": "Kecepatan+Merapal",
		 "CSPD%": "Kecepatan+Merapal+%25",
		 "FIRE": "Unsur+Api+%28no+matching%29",
		 "WATER": "Unsur+Air+%28no+matching%29",
		 "EARTH": "Unsur+Bumi+%28no+matching%29",
		 "WIND": "Unsur+Angin+%28no+matching%29",
		 "LIGHT": "Unsur+Cahaya+%28no+matching%29",
		 "DARK": "Unsur+Gelap+%28no+matching%29",
		 "FIREM": "Unsur+Api+%28matching%29",
		 "WATERM": "Unsur+Air+%28matching%29",
		 "EARTHM": "Unsur+Bumi+%28matching%29",
		 "WINDM": "Unsur+Angin+%28matching%29",
		 "LIGHTM": "Unsur+Cahaya+%28matching%29",
		 "DARKM": "Unsur+Gelap+%28matching%29",
		 "ACC": "Accuracy",
		 "DODGE": "Dodge",
		 "ACC%": "Accuracy+%25",
		 "DODGE%": "Dodge+%25",
		 "STAB%": "Stability+%25",
		 "MPIERCE%": "Magic+Pierce+%25",
		 "PPIERCE%": "Penetrasi+Fisik+%25",
		 "HPREGEN": "Natural+HP+Regen",
		 "MPREGEN": "Natural+MP+Regen",
		 "HPREGEN%": "Natural+HP+Regen+%25",
		 "MPREGEN%": "Natural+MP+Regen+%25",
		 "DEF": "DEF",
		 "MDEF": "MDEF",
		 "DEF%": "DEF+%25",
		 "MDEF%": "MDEF+%25",
	 };
	 
	 let match;
	 let extractedStats = [];
	 let negativeStats = [];
	 const potRegex = /Weapon pot: (\d+)/i;
	 const potMatch = message.match(potRegex);
	 const potValue = potMatch ? parseInt(potMatch[1]) : null;
	 
	 while ((match = statRegex.exec(message)) !== null) {
		 let statName, statValue;
	 
		 const shortName = match[1];
		 const value = parseInt(match[2]);
	 
		 statName = statTranslate[shortName] || shortName;
	 
		 if (shortName.toLowerCase() === 'pot') {
			 potValue = value;
		 } else {
			 if (value < 0) {
				 negativeStats.push({ stat: statName, value: "MAX" });
			 } else {
				 extractedStats.push({ stat: statName, value: value });
			 }
		 }
	 }
	 
	 while (extractedStats.length < 7) {
		 extractedStats.push({ stat: "", value: "MAX" });
	 }
	 
	 while (negativeStats.length < 7) {
		 negativeStats.push({ stat: "", value: "MAX" });
	 }
    let data = `properBui=Weapon&paramLevel=280&plusProperList%5B0%5D.properName=${extractedStats[0].stat}&plusProperList%5B0%5D.properLvHyoji=${extractedStats[0].value}&plusProperList%5B1%5D.properName=${extractedStats[1].stat}&plusProperList%5B1%5D.properLvHyoji=${extractedStats[1].value}&plusProperList%5B2%5D.properName=${extractedStats[2].stat}&plusProperList%5B2%5D.properLvHyoji=${extractedStats[2].value}&plusProperList%5B3%5D.properName=${extractedStats[3].stat}&plusProperList%5B3%5D.properLvHyoji=${extractedStats[3].value}&plusProperList%5B4%5D.properName=${extractedStats[4].stat}&plusProperList%5B4%5D.properLvHyoji=${extractedStats[4].value}&plusProperList%5B5%5D.properName=${extractedStats[5].stat}&plusProperList%5B5%5D.properLvHyoji=${extractedStats[5].value}&plusProperList%5B6%5D.properName=${extractedStats[6].stat}&plusProperList%5B6%5D.properLvHyoji=${extractedStats[6].value}&minusProperList%5B0%5D.properName=${negativeStats[0].stat}&minusProperList%5B0%5D.properLvHyoji=MAX&minusProperList%5B1%5D.properName=${negativeStats[1].stat}&minusProperList%5B1%5D.properLvHyoji=MAX&minusProperList%5B2%5D.properName=${negativeStats[2].stat}&minusProperList%5B2%5D.properLvHyoji=MAX&minusProperList%5B3%5D.properName=${negativeStats[3].stat}&minusProperList%5B3%5D.properLvHyoji=MAX&minusProperList%5B4%5D.properName=${negativeStats[4].stat}&minusProperList%5B4%5D.properLvHyoji=MAX&minusProperList%5B5%5D.properName=${negativeStats[5].stat}&minusProperList%5B5%5D.properLvHyoji=MAX&minusProperList%5B6%5D.properName=${negativeStats[6].stat}&minusProperList%5B6%5D.properLvHyoji=MAX&shokiSenzai=${potValue}&kisoSenzai=15&jukurendo=0&rikaiKinzoku=10&rikaiNunoti=10&rikaiKemono=10&rikaiMokuzai=10&rikaiYakuhin=10&rikaiMaso=10&sendData=Submit`;
  
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://tanaka0.work/id/BukiProper',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Cookie': 'JSESSIONID=9C4CB3F3674603DFAFCA22054CC2B976'
        },
        data : data
    };
  
    try {
        const response = await axios.request(config);
        const $ = cheerio.load(response.data);

        const stat = $('#main > div:nth-of-type(2)').clone();
stat.find('h3, a, font, b').remove(); 
const formattedStat = stat.text().trim().replace(/(\w+\s*%?)\s*(Lv\.(-?\d+))/g, (match, p1, p2, p3) => {
    const sign = parseInt(p3) >= 0 ? '+' : '';
    return `${p1} ${sign}${p3}`;
}).replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ');
 // Hapus spasi ganda

        const steps = $('#main div:nth-of-type(4)').text().trim().replace(/Steps\b/, '').trim();
        const recipe = steps.replace(/\s+/g, ' ').replace(/(\d+\.\s+)/g, '\n$1');
        const hasil = `*Chizuru-chan🌸*
Jenis: Weapon
Level Karakter: 280

Stat akhir: 
${formattedStat}

${recipe}`;
        return hasil;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
async function fillstata(message) {
	const statRegex = /([A-Z]+%?)\s+(-?\d+)/ig;
	const statTranslate = {
		"A%": "ATK+%25",
		"A": "ATK",
		"M%": "MATK+%25",
		"M": "MATK",
		"S%": "STR+%25",
		"S": "STR",
		"D%": "DEX+%25",
		"D": "DEX",
		"I%": "INT+%25",
		"I": "INT",
		"V%": "VIT+%25",
		"V": "VIT",
		"AG%": "AGI+%25",
		"AG": "AGI",
		"CD%": "Critical+Damage+%25",
		"CD": "Critical+Damage",
		"CR%": "Critical+Rate+%25",
		"CR": "Critical+Rate",
		"DTF%": "%25+luka+ke+Api",
		"DTE%": "%25+luka+ke+Bumi",
		"DTW%": "%25+luka+ke+Air",
		"DTA%": "%25+luka+ke+Angin",
		"DTL%": "%25+luka+ke+Cahaya",
		"DTD%": "%25+luka+ke+Gelap",
		"ASPD": "Kecepatan+Serangan",
		"ASPD%": "Kecepatan+Serangan+%25",
		"CSPD": "Kecepatan+Merapal",
		"CSPD%": "Kecepatan+Merapal+%25",
		"ACC": "Accuracy",
		"DODGE": "Dodge",
		"ACC%": "Accuracy+%25",
		"DODGE%": "Dodge+%25",
		"STAB%": "Stability+%25",
		"MPIERCE%": "Magic+Pierce+%25",
		"PPIERCE%": "Penetrasi+Fisik+%25",
		"HPREGEN": "Natural+HP+Regen",
		"MPREGEN": "Natural+MP+Regen",
		"HPREGEN%": "Natural+HP+Regen+%25",
		"MPREGEN%": "Natural+MP+Regen+%25",
		"DEF": "DEF",
		"MDEF": "MDEF",
		"DEF%": "DEF+%25",
		"MDEF%": "MDEF+%25",
	};
	
	let match;
	let extractedStats = [];
	let negativeStats = [];
	const potRegex = /Armor pot: (\d+)/i;
	const potMatch = message.match(potRegex);
	const potValue = potMatch ? parseInt(potMatch[1]) : null;
	
	while ((match = statRegex.exec(message)) !== null) {
		let statName, statValue;
	
		const shortName = match[1];
		const value = parseInt(match[2]);
	
		statName = statTranslate[shortName] || shortName;
	
		if (shortName.toLowerCase() === 'pot') {
			potValue = value;
		} else {
			if (value < 0) {
				negativeStats.push({ stat: statName, value: "MAX" });
			} else {
				extractedStats.push({ stat: statName, value: value });
			}
		}
	}
	
	while (extractedStats.length < 7) {
		extractedStats.push({ stat: "", value: "MAX" });
	}
	
	while (negativeStats.length < 7) {
		negativeStats.push({ stat: "", value: "MAX" });
	}
   let data = `properBui=Armor&paramLevel=280&plusProperList%5B0%5D.properName=${extractedStats[0].stat}&plusProperList%5B0%5D.properLvHyoji=${extractedStats[0].value}&plusProperList%5B1%5D.properName=${extractedStats[1].stat}&plusProperList%5B1%5D.properLvHyoji=${extractedStats[1].value}&plusProperList%5B2%5D.properName=${extractedStats[2].stat}&plusProperList%5B2%5D.properLvHyoji=${extractedStats[2].value}&plusProperList%5B3%5D.properName=${extractedStats[3].stat}&plusProperList%5B3%5D.properLvHyoji=${extractedStats[3].value}&plusProperList%5B4%5D.properName=${extractedStats[4].stat}&plusProperList%5B4%5D.properLvHyoji=${extractedStats[4].value}&plusProperList%5B5%5D.properName=${extractedStats[5].stat}&plusProperList%5B5%5D.properLvHyoji=${extractedStats[5].value}&plusProperList%5B6%5D.properName=${extractedStats[6].stat}&plusProperList%5B6%5D.properLvHyoji=${extractedStats[6].value}&minusProperList%5B0%5D.properName=${negativeStats[0].stat}&minusProperList%5B0%5D.properLvHyoji=MAX&minusProperList%5B1%5D.properName=${negativeStats[1].stat}&minusProperList%5B1%5D.properLvHyoji=MAX&minusProperList%5B2%5D.properName=${negativeStats[2].stat}&minusProperList%5B2%5D.properLvHyoji=MAX&minusProperList%5B3%5D.properName=${negativeStats[3].stat}&minusProperList%5B3%5D.properLvHyoji=MAX&minusProperList%5B4%5D.properName=${negativeStats[4].stat}&minusProperList%5B4%5D.properLvHyoji=MAX&minusProperList%5B5%5D.properName=${negativeStats[5].stat}&minusProperList%5B5%5D.properLvHyoji=MAX&minusProperList%5B6%5D.properName=${negativeStats[6].stat}&minusProperList%5B6%5D.properLvHyoji=MAX&shokiSenzai=${potValue}&kisoSenzai=15&jukurendo=0&rikaiKinzoku=10&rikaiNunoti=10&rikaiKemono=10&rikaiMokuzai=10&rikaiYakuhin=10&rikaiMaso=10&sendData=Submit`;
 
   let config = {
	   method: 'post',
	   maxBodyLength: Infinity,
	   url: 'https://tanaka0.work/id/BouguProper',
	   headers: { 
		   'Content-Type': 'application/x-www-form-urlencoded', 
		   'Cookie': 'JSESSIONID=08D6228281542B6C3B8431F4F8361804'
	   },
	   data : data
   };
 
   try {
	   const response = await axios.request(config);
	   const $ = cheerio.load(response.data);

	   const stat = $('#main > div:nth-of-type(2)').clone();
stat.find('h3, a, font, b').remove(); 
const formattedStat = stat.text().trim().replace(/(\w+\s*%?)\s*(Lv\.(-?\d+))/g, (match, p1, p2, p3) => {
   const sign = parseInt(p3) >= 0 ? '+' : '';
   return `${p1} ${sign}${p3}`;
}).replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ');
// Hapus spasi ganda

	   const steps = $('#main div:nth-of-type(4)').text().trim().replace(/Steps\b/, '').trim();
	   const recipe = steps.replace(/\s+/g, ' ').replace(/(\d+\.\s+)/g, '\n$1');
	   const hasil = `*Chizuru-chan🌸*
Jenis: Armor
Level Karakter: 280

Stat akhir: 
${formattedStat}

${recipe}`;
	   return hasil;
   } catch (error) {
	   console.error('Error:', error);
	   return null;
   }
}

async function facebook(url) {
	try {
	  const params = new URLSearchParams();
	  params.append('URLz', url);
  
	  const response = await axios.post('https://www.fdown.net/download.php', params, {
		headers: {
		  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
		  'Accept-Language': 'en-US,en;q=0.9,id;q=0.8,ar;q=0.7,ms;q=0.6',
		  'Cache-Control': 'max-age=0',
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'Cookie': '_ga=GA1.1.1890950555.1715398826; cf_clearance=n7zNyJmnmv.RyRWU9UzizOZqRuUEN57.dfHqnNKEFuY-1715398826-1.0.1.1-nToIrdmXHszhP_9JBJp5wwzbkOQ4qUYd5BBHZGYznNl7JQEqaE4ZYKrhOzaQi1hEpmAZ3mxJd8Rj08e6RT1xrw; __gads=ID=bf429288d74a0d7d:T=1715398826:RT=1715399236:S=ALNI_Mbq8t5yfOhAwsLPmunsgyAw0cUKJA; __gpi=UID=00000e16d84b9d3d:T=1715398826:RT=1715399236:S=ALNI_MZEigB8ZGBUosnvvzsdscEA85Ft4A; __eoi=ID=11c9a6dc659e2680:T=1715398826:RT=1715399236:S=AA-AfjaDsV35uF8O-YH6WgWLqF69; FCNEC=%5B%5B%22AKsRol_sNiJjG6s9ojB8jVa088kWjjlhixjXOHBABXIH3UXE_e1mCFD9JDlrNYgLl4ARPUQmmY2j7JpI02FrZ1F-2YMKP-8uFn28uvLwzflW6kwtVJbW13dPPRiCo3gT6rLFLW3QC1Ajx1Brqv9-NHcRCJcCpEF1dA%3D%3D%22%5D%5D; _ga_82ERN9JZD3=GS1.1.1715398825.1.1.1715399565.58.0.0',
		  'Origin': 'https://www.fdown.net',
		  'Priority': 'u=0, i',
		  'Referer': 'https://www.fdown.net',
		  'Sec-Ch-Ua': '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
		  'Sec-Ch-Ua-Mobile': '?0',
		  'Sec-Fetch-Dest': 'document',
		  'Sec-Fetch-Mode': 'navigate',
		  'Sec-Fetch-Site': 'same-origin',
		  'Sec-Fetch-User': '?1',
		  'Upgrade-Insecure-Requests': '1',
		  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0'
		},
	  });
	  const $ = cheerio.load(response.data);
  
	  const downloadLinks = {
		sd: await turl.shorten($("a#sdlink").attr("href")),
		hd: await turl.shorten($("a#hdlink").attr("href"))
	  };
  
	  return { downloadLinks };
	} catch (error) {
	  console.error(error);
	  throw error;
	}
  }
async function aichat(input) {
    try {
        const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCaK_5SPC7U3eKANr5opfdlih2KlR_HlsE', {      
      contents: [{
        parts:[{
          text: input}]}]
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const gptResponse = response.data.candidates[0].content.parts[0].text.trim();

        return `*Chizu x Gemini✨*
		
${gptResponse}`;
    } catch (error) {
        console.error('Error:', error);
        return 'Maaf, terjadi kesalahan dalam memproses permintaan Anda.';
    }
}

const infodye = `*Chizuru-chan🌸*

Gunakan tools ini kak untuk melihat list dye bulan ${bulan} ${tahun}. Terima kasih kepada Tanaka yang telah menyediakan tools ini.
https://tanaka0.work/AIO/en/DyePredictor/ColorWeapon`;

const infoailment = `*Chizuru-chan🌸*

Berikut adalah daftar efek status buruk yang dapat diberikan kepada monster dan player:
1) Bergidik
- ke monster: Interupsi aksinya sejenak (Singkat)
- ke player: Interupsi tindakan mereka sejenak (Singkat)

2) Jatuh
- ke monster: Interupsi aksinya sejenak (Sedang)
- ke player: Interupsi tindakan mereka sejenak (Sedang)

3) Pingsan
- ke monster: Interupsi aksinya sejenak (Lama)
- ke player: Interupsi tindakan mereka sejenak (Lama)

4) Knock Back (Terpelanting)
- ke monster: Interupsi aksinya sejenak, terpelanting ke belakang untuk beberapa jarak
- ke player: Interupsi aksinya sejenak, terpelanting ke belakang untuk beberapa jarak

5) Poison (Racun)
- ke monster: Menimbulkan beberapa kerusakan untuk setiap tindakan selama 10 detik
- ke player: Menimbulkan kerusakan sebesar 5% dari sisa HP pada setiap tindakan, kerusakan ini tidak dapat membunuh pemain

6) Ignite (Terbakar)
- ke monster: Menimbulkan beberapa kerusakan untuk setiap 1 detik (3 detik) selama 10 detik
- ke player: Menimbulkan kerusakan sebesar 15% dari sisa HP terkini, kerusakan ini tidak dapat membunuh pemain

7) Freeze (Beku)
- ke monster: Mengurangi kecepatan gerak hingga 50%, berlangsung selama 10 detik. Dapat digunakan kembali saat durasi berakhir
- ke player: Mengurangi 50% kecepatan gerak (moontion speed) dan Ayunan Dewa (Godspeed Wield), Memiliki durasi 10 detik.

8) Slow (Lambat)
- ke monster: Mengurangi kecepatan gerakan target sebesar 50% (25% untuk bos). Memiliki durasi 10 detik
- ke player: Menurunkan 50% kecepatan berjalan (movement speed), durasi efek 10 detik. Evasion, Evasion recharge dan Shukuchi dinonaktifkan

9) Stop (Berhenti)
- ke monster: Mengikat musuh ke posisinya saat ini selama 10 detik, memiliki cooldown 60 detik. Lebih efektif untuk monster dan bos mini. Pola serangan seperti garis lurus atau serangan rapalan dapat digunakan saat mendapatkan debuff berhenti.
- ke player: Tidak dapat berpindah tempat atau berjalan, durasi 10 detik. Masih bisa menggunakan skil gerak (motion) dan rapalan seperti slash dapat digunakan saat mendapatkan debuff berhenti. Tidak dapat Evasion, Evasion recharge dan Shukuchi terhenti.

10) Dizzy (Pening)
- ke monster: Menurunkan tingkat guard dan evasion sebesar 100% (Boss 50%)
- ke player: Menonaktifkan Evasion dan Guard recharge

11) Dazzled (Silau)
- ke monster: Flee -50%
- ke player: -

12) Paralysis (Lumpuh)
- ke monster: Tingkatkan penundaan tindakan
- ke player: Mengurangi 50% ASPD (Attack Speed/Kecepatan Serangan)

13) Blind (Buta)
- ke monster: Mengurangi akurasi 50%
- ke player: Penurunan Akurasi sebesar 20% untuk serangan dalam jarak 7m, dan 40% untuk 8m ke atas

14) Fear (Takut)
- ke monster: 30% kemungkinan untuk membatalkan tindakan
- ke player: 30% peluang gagal mengeluarkan skill

15) Lethargy (Lesu)
- ke monster: Output kerusakan berkurang 30%
- ke player: Output kerusakan berkurang 30%

16) Weaken (Lemah)
- ke monster: Mengurangi MDEF target sebesar 25%.
- ke player: Menambah Biaya konsumsi MP untuk semua keterampilan +100

17) Bleed (Berdarah)
- ke monster: Tidak dapat menggunakan skill fisik
- ke player: Tidak dapat menggunakan skill fisik

18) Silence (Bisu)
- ke monster: Tidak dapat menggunakan skill sihir
- ke player: Tidak dapat menggunakan skill sihir

19) Confused
- ke monster: -
- ke player: -

20) Armor Break (Pecah Zirah)
- ke monster: DEF & MDEF -50%
- ke player: Mengurangi kekebalan fisik dan sihir hingga 50%, tidak dapat menggunakan Guard

21) Fatigue (Lelah)
- ke monster: Mengurangi stabilitas 50%, pada serangan durasi terakhir akan mengalami graze.
- ke player: Mengurangi stabilitas 50%, pada serangan durasi terakhir akan mengalami graze.

22) Sleep (Tidur)
- ke monster: Melumpuhkan untuk waktu yang lama, bangun saat menerima serangan, Bos memulihkan 3% dari HP maksimal saat bangun
- ke player: Melumpuhkan untuk waktu yang lama, bangun saat menerima serangan, mengaktifkan regenerasi alami

23) Mana Explosion (Ledakan Mana)
- ke monster: -
- ke player: Setelah durasi berakhir, konsumsi semua mp menjadi 0 dan memberikan damage sama dengan konsumsi mp x10

24) Sick (Sakit)
- ke monster: Menurunkan resistensi status buruk sebesar -50% (masih dapat terkena bahkan jika Anda memiliki resistensi status buruk 100%)
- ke player: Menurunkan resistensi status buruk sebesar -50% (masih dapat terkena bahkan jika Anda memiliki resistensi status buruk 100%)

25) Curse (Terkutuk)
- ke monster: Menurunkan CRT damage pemain sebesar -50%
- ke player: Menurunkan CRT damage pemain sebesar -50%

26) Item Disable
- ke monster: -
- ke player: Tidak dapat menggunakan barang

27) Overdrive (Lari)
- ke monster: -
- ke player: Mengonsumsi HP saat MP tidak mencukupi untuk melakukan skill, juga menerapkan tenacity (Gigih) ke semua skill dalam kombo (tidak mengganti tag yang ada)

28) Suction (Pengisapan)
- ke monster: Menarik ke pusat serangan, 50% peluang tarik untuk Bos
- ke player: Menarik ke pusat serangan, saat terkena menonaktifkan evasion dan Guard selama 1 detik

29) Petrified (Kaku)
- ke monster: Menghindar Mutlak +100%, & menghapus aggro saat ini sebesar 99%
- ke player: Menghindar Mutlak +100%, & menghapus aggro saat ini sebesar 99%

30) Inversion (Inversi)
- ke monster: -
- ke player: Mengganti HP% dan MP% Anda saat ini`;

const panduanfill = `*Chizuru-chan🌸*

Untuk menggunakan fitur ini, silahkan ketikkan stat yang ingin diisi, maksimal 8 list stat. PENTING: STAT MINUS WAJIB BERNILAI -1. Contoh:
---------------
Weapon pot: 116

LIGHT 1
DTD% 22
CD 20
CD% 3
CR 28
HPREGEN -1
MPREGEN -1
DODGE -1
---------------
Armor pot: 98

DTD% 22
CD 22
CD% 11
CR 28
M% -1
MPIERCE% -1
ACC -1
ACC% -1
---------------
*List prefix stat:*
A% (ATK%)
A (ATK)
M% (MATK%)
M (MATK)
S% (STR%)
S (STR)
D% (DEX%)
D (DEX)
I% (INT%)
I (INT)
V% (VIT%)
V (VIT)
AG% (AGI%)
AG (AGI)
CD% (Critical Damage%)
CD (Critical Damage)
CR% (Critical Rate%)
CR (Critical Rate)
DTF% (% luka ke Api)
DTE% (% luka ke Bumi)
DTW% (% luka ke Air)
DTA% (% luka ke Angin)
DTL% (% luka ke Cahaya)
DTD% (% luka ke Gelap)
ASPD (Kecepatan Serangan)
ASPD% (Kecepatan Serangan%)
CSPD (Kecepatan Merapal)
CSPD% (Kecepatan Merapal%)
FIRE (Unsur Api (no matching))
WATER (Unsur Air (no matching))
EARTH (Unsur Bumi (no matching))
WIND (Unsur Angin (no matching))
LIGHT (Unsur Cahaya (no matching))
DARK (Unsur Gelap (no matching))
FIREM (Unsur Api (matching))
WATERM (Unsur Air (matching))
EARTHM (Unsur Bumi (matching))
WINDM (Unsur Angin (matching))
LIGHTM (Unsur Cahaya (matching))
DARKM (Unsur Gelap (matching))
ACC (Accuracy)
DODGE (Dodge)
ACC% (Accuracy%)
DODGE% (Dodge%)
STAB% (Stability%)
MPIERCE% (Magic Pierce%)
PPIERCE% (Penetrasi Fisik%)
HPREGEN (Natural HP Regen)
MPREGEN (Natural MP Regen)
HPREGEN% (Natural HP Regen%)
MPREGEN% (Natural MP Regen%)
DEF (DEF)
MDEF (MDEF)
DEF% (DEF%)
MDEF% (MDEF%)`;

const help = `*Chizuru-chan🌸*

Panduan dasar penggunaan Chizuru Bot by Revanda:
1. Untuk melihat menu, ketik *menu*.
2. Selalu gunakan huruf kecil untuk setiap command.
Contoh: *mt terbaru*, *info dye*
3. Bila ada tanda [ ] artinya command dinamis. Masukan perintah *tanpa menulis* [ ].
Contoh: *harga slot ohs*, *cari item proto*
4. Bila ada tanda / (slash) artinya pilih salah satu.
Contoh: *lvling char miniboss 200*
5. Untuk *stikerin*, kirim gambar dahulu, lalu balas gambar tersebut dengan *stikerin*.
6. Menu admin hanya boleh diakses admin grup.
7. Admin dapat custom pesan welcome, hubungi Revanda.
8. Bantuan owner, [Revanda] 085159199040.`;


async function registlet(query) {
    try {
        const response = await axios.get(`https://torampedia.my.id/api/registlet/search/${query}`);
        const data = response.data;
        if (data.length === 0) {
            return "Tidak ada hasil yang ditemukan untuk pencarian ini.";
        }
        let resultMessage = "*Chizuru-chan🌸*\nSiap kak, ajak member lain kalau mau Stoodie:\n";
        data.forEach((item, index) => {
            resultMessage += `\n*Nama:* ${item.name_en}\n`;
            resultMessage += `*Max Lv:* ${item.max}\n`;
            resultMessage += `*Efek:* ${item.effect_en}\n`;
            resultMessage += `*Dari:* Stoodie ${item.from}\n`;
        });
        return resultMessage;
    } catch (error) {
        console.error('Error fetching registlet data:', error.message);
        return 'Terjadi kesalahan dalam pencarian registlet.';
    }
}

const reqfiturmsg =`*Chizuru-chan🌸*

Pesan kakak sudah Chizu teruskan ke master Revanda, master akan berusaha melatih Chizu untuk belajar hal baru.

Terima kasih kak ${m.pushname}`;

		if(m.body == "menu"){
			return bot.specialmenu(menuChizu, m.msg);
		}else if ((linklist.some(keyword => m.body.includes(keyword))) && (await VipGrup.getGroup(m.from)).antilink) {
			await bot.sendText(`Peringatan kepada @${m.sender.split("@")[0]}. Link tidak diizinkan dalam grup ini.`, m.msg);
			await bot.deleteMessage(m);
		} else if ((regex.test(m.body)) && (await VipGrup.getGroup(m.from)).antitoxic) {
			await bot.sendText(`Peringatan kepada @${m.sender.split("@")[0]}. Pesan kamu mengandung konten toxic.`, m.msg);
			await bot.deleteMessage(m);
		}else if (m.body.length >= 10000) {

const phoneNumber = m.sender;
const extractedPhoneNumber = phoneNumber.split("@")[0];
const tag = `@${extractedPhoneNumber}`;
const command = "remove";
			await bot.deleteMessage(m);
			await bot.sendText(`@${extractedPhoneNumber} akan dikeluarkan dari grup. Alasan: mengirim pesan virtex.`, m.msg)
			await bot.partisipant(tag, command);
		}else if(match){
			const jenisMonster = match[1];
			const level = match[2];
			const resultdata = await levelingfunc(jenisMonster, level);
			const loadingmsg = await bot.reply(loading, m.msg);
await bot.replyedit(resultdata, m.msg, loadingmsg.key);
		}else if(m.body == "kode live"){
			return bot.reply(codelive, m.msg);
		}else if(searchitem){
			let query = searchitem[1];
    		query = query.replace(/\s{1,3}/g, '%20');
			const loadingmsg = await bot.reply(loading, m.msg);
			const item = await itemsearch(query);
await bot.replyedit(item, m.msg, loadingmsg.key);
		}else if(m.body == "bahan tas"){
			return bot.reply(bagupgrade, m.msg);
		}else if(searchmonster){
			let query = searchmonster[1];
    		query = query.replace(/\s{1,3}/g, '%20');
			const loadingmsg = await bot.reply(loading, m.msg);
			const monster = await monstersearch(query);
await bot.replyedit(monster, m.msg, loadingmsg.key);
		}else if (/^harga slot (ohs|1h|p1t|pd)$/.test(m.body)) {
			return bot.reply(priceohs, m.msg);
		}else if (/^harga slot (2h|pdr|ths|p2t)$/.test(m.body)) {
			return bot.reply(priceths, m.msg);
		}else if (/^harga slot (tj|knuck|knuckle|tinju)$/.test(m.body)) {
			return bot.reply(priceknuck, m.msg);
		}else if (/^harga slot (tombak|hb|halberd|tb)$/.test(m.body)) {
			return bot.reply(pricehb, m.msg);
		}else if (/^harga slot (bow|busur|bw)$/.test(m.body)) {
			return bot.reply(pricebow, m.msg);
		}else if (/^harga slot (bowgun|bwg)$/.test(m.body)) {
			return bot.reply(pricebwg, m.msg);
		}else if (/^harga slot (md|pst|pesawat|pesawat sihir|magic device)$/.test(m.body)) {
			return bot.reply(pricemd, m.msg);
		}else if (/^harga slot (staff|stf|tkt|tongkat)$/.test(m.body)) {
			return bot.reply(pricestf, m.msg);
		}else if (/^harga slot (katana|ktn)$/.test(m.body)) {
			return bot.reply(pricektn, m.msg);
		}else if (/^harga slot (armor|needle|arm)$/.test(m.body)) {
			return bot.reply(pricearm, m.msg);
		}else if (/^harga slot (add|silk|topi|additional)$/.test(m.body)) {
			return bot.reply(priceadd, m.msg);
		}else if (/^harga slot (ring|special|ornament|orn)$/.test(m.body)) {
			return bot.reply(pricering, m.msg);
		}else if(m.body == "bahan mq"){
			return bot.reply(bahanmq, m.msg);
		}else if(m.body == "kalkulator quest"){
			return bot.reply(mqcalculator, m.msg);
		}else if (invite && m.group.isSenderGroupAdmin && m.group.isBotGroupAdmin) {
			const member = invite[1];
			const command = "add";
			await bot.addParticipant(member, command);
		}else if (kick && m.group.isSenderGroupAdmin && m.group.isBotGroupAdmin) {
				const member = kick[1];
				const command = "remove";
				await bot.sendText(`*Chizuru-chan🌸*

Sayonara kak ${member}, lain kali jangan nakal ya...`, m.msg);
				await bot.partisipant(member, command);
		} else if (promote && m.group.isSenderGroupAdmin && m.group.isBotGroupAdmin) {
			const member = promote[1];
			const command = "promote";
			await bot.partisipant(member, command);
			await bot.sendText(`*Chizuru-chan🌸*
			
${member} berhasil Chizu promosikan`, m.msg);
		} else if (demote && m.group.isSenderGroupAdmin && m.group.isBotGroupAdmin) {
			const member = demote[1];
			const command = "demote";
			await bot.partisipant(member, command);
			await bot.sendText(`*Chizuru-chan🌸*
			
${member} berhasil Chizu demote`, m.msg);
		} else if (matchAntiToxic && m.group.isSenderGroupAdmin) {
			const status = matchAntiToxic[1];
			if (status == "on") {
				await VipGrup.findOneAndUpdate(m.from, { antitoxic: 1 });
				await bot.reply(`*Chizuru-chan🌸*

Anti Toxic berhasil diaktifkan`, m.msg);
			} else if (status == "off") {
				await VipGrup.findOneAndUpdate(m.from, { antitoxic: 0 });
				await bot.reply(`*Chizuru-chan🌸*

Anti Toxic berhasil dimatikan`, m.msg);}
		} else if (matchAntiLink && m.group.isSenderGroupAdmin) {
			const status = matchAntiLink[1];
			if (status == "on") {
				await VipGrup.findOneAndUpdate(m.from, { antilink: 1 });
				await bot.reply(`*Chizuru-chan🌸*

Anti Link berhasil diaktifkan`, m.msg);}
			else if (status == "off") {
				await VipGrup.findOneAndUpdate(m.from, { antilink: 0 });
				await bot.reply(`*Chizuru-chan🌸*

Anti Link berhasil dimatikan`, m.msg);}
		} else if (matchWelcome && m.group.isSenderGroupAdmin) {
			const status = matchWelcome[1];
			if (status == "on") {
				await VipGrup.findOneAndUpdate(m.from, { welcome: 1 });
				await bot.reply(`*Chizuru-chan🌸*

Pesan welcome berhasil diaktifkan`, m.msg);}
			else if (status == "off") {
				await VipGrup.findOneAndUpdate(m.from, { welcome: 0 });
				await bot.reply(`*Chizuru-chan🌸*

Pesan welcome berhasil dimatikan`, m.msg);}
		} else if (matchOut && m.group.isSenderGroupAdmin) {
			const status = matchOut[1];
			if (status == "on") {
				await VipGrup.findOneAndUpdate(m.from, { out: 1 });
				await bot.reply(`*Chizuru-chan🌸*

Pesan out berhasil diaktifkan`, m.msg);}
			else if (status == "off") {
				await VipGrup.findOneAndUpdate(m.from, { out: 0 });
				await bot.reply(`*Chizuru-chan🌸*

Pesan out berhasil dimatikan`, m.msg);}
		}else if(anime){
			const query=anime[1];
			const loadingmsg = await bot.reply(loading, m.msg);
			const data = await animesearch(query);
			return bot.replyedit(data, m.msg, loadingmsg.key);
		}else if(manga){
			const query=manga[1];
			const loadingmsg = await bot.reply(loading, m.msg);
			const data = await mangasearch(query);
			return bot.replyedit(data, m.msg, loadingmsg.key);
		}else if(anime2){
			const query=anime2[1];
			const loadingmsg = await bot.reply(loading, m.msg);
			const data = await animesearch2(query);
			return bot.replyedit(data, m.msg, loadingmsg.key);
		}else if(manga2){
			const query=manga2[1];
			const loadingmsg = await bot.reply(loading, m.msg);
			const data = await mangasearch2(query);
			return bot.replyedit(data, m.msg, loadingmsg.key);
		}else if(m.body == "on going anime"){
			const ongoinganime = await ongoingnime();
			return bot.reply(ongoinganime, m.msg);
		}else if(m.body == "random anime quotes"){
			const randomquotes = await randomquotesnime();
			return bot.reply(randomquotes, m.msg);
		}else if(matchPot1){
			const loadingmsg = await bot.reply(loading, m.msg);
			const fill = await fillstatw(m.body);
await bot.replyedit(fill, m.msg, loadingmsg.key);
		}else if(matchPot2){
			const loadingmsg = await bot.reply(loading, m.msg);
			const fill = await fillstata(m.body);
await bot.replyedit(fill, m.msg, loadingmsg.key);
		}else if(tiktokdl){
			const url = tiktokdl[1];
			const loadingmsg = await bot.reply(loading, m.msg);
			const data = await tiktok(url);
			await bot.replyedit(`*Chizuru-chan🌸*
		
Video berhasil Chizu dapatkan kak, silahkan klik link dibawah ini untuk mengunduh dengan kualitas terbaik:
*Tanpa Watermark*
${data.nowm}

*Watermark*
${data.wm}`, m.msg, loadingmsg.key);
		}else if(fb){
			const url = fb[1];
			const loadingmsg = await bot.reply(`*Chizuru-chan🌸*

Sebentar ya kak, Chizu membutuhkan banyak waktu untuk menangani proses ini...`, m.msg);
			const data = await facebook(url);
			await bot.replyedit(`*Chizuru-chan🌸*

Video berhasil Chizu dapatkan kak, silahkan klik link dibawah ini untuk mengunduh dengan kualitas terbaik:
*Standart Quality*
${data.downloadLinks.sd}

*High Quality*
${data.downloadLinks.hd}`, m.msg, loadingmsg.key);
		}else if(ig){
			const url = ig[1];
			const loadingmsg = await bot.reply(loading, m.msg);
			const data = await instagram(url);
			await bot.replyedit(`*Chizuru-chan🌸*
		
Video berhasil Chizu dapatkan kak, silahkan klik link dibawah ini untuk mengunduh dengan kualitas terbaik:
${data.link}`, m.msg, loadingmsg.key);
		}else if (m.isMedia.isQuotedImage && m.body == "stikerin") {
			const buffer = await m.quoted.download();
			let exif = {
				packName: `Chizuru`,
				packPublish: "Chizuru",
			};
			bot.sendSticker(false, "image", buffer, exif.packName, exif.packPublish);
		}else if(m.body == "wm stiker"){
			return bot.reply(wmstiker, m.msg);
		}else if (chatai) {
			let query = chatai[1];
			const loadingmsg = await bot.reply(`*Chizuru-chan🌸*

AI sedang berfikir...`, m.msg);
			const response = await aichat(query);
			await bot.replyedit(response, m.msg, loadingmsg.key);
		}else if(reqfitur){
			await bot.forwardMessage(reqfitur[1]);
			await bot.reply(reqfiturmsg, m.msg);
		}else if(m.body == "info dye"){
			await bot.reply(infodye, m.msg);
		}else if(m.body == "info ailment"){
			await bot.reply(infoailment, m.msg);
		}else if(m.body == "help"){
			await bot.reply(help, m.msg);
		}else if(m.body == "racik rumus fill"){
			await bot.reply(panduanfill, m.msg);
		}else if(regist){
			const q = regist[1];
			const loadingmsg = await bot.reply(loading, m.msg);
			const data = await registlet(q);
			await bot.replyedit(`${data}`, m.msg, loadingmsg.key);
		}else if(m.body == "lvling bs tec"){
			return bot.reply(lvlingbs2, m.msg);
		}else if(m.body == "lvling bs non"){
			return bot.reply(lvlingbs1, m.msg);
		}else if(m.body == "lvling alche"){
			return bot.reply(lvlingalcheChizu, m.msg);
		} else if(m.body == "info farm mats"){
			return bot.reply(farminfoChizu, m.msg);
		} else if(m.body == "ninja scroll"){
			return bot.reply(ninjascrollChizu, m.msg);
		} else if(m.body == "buff food"){
			return bot.reply(bufffoodChizu, m.msg);
		} else if(m.body == "kamus besar toram"){
			return bot.reply(kamusChizu, m.msg);
		} else if(m.body == "pet lvling"){
			return bot.reply(petlvlingChizu, m.msg);
		} else if(m.body == "arrow elemental"){
			return bot.reply(arrowChizu, m.msg);
		} else if(m.body == "build toram"){
			return bot.reply(buildChizu, m.msg);
		}else if(m.body == "info bot"){
			return bot.reply(infobot, m.msg);
		}else if(m.body == "grup status"){
			return bot.reply(metadata2, m.msg);
		}else if (m.body.includes("chizuu aku pulang")) {
			await bot.reply(`*Chizuru-chan🌸* 

Okaeri onii chan`, m.msg);
			await delay(500);
			await bot.sendText(`Gohan ni suru?`, m.msg);
			await delay(500);
			await bot.sendText(`Ofuro ni suru?`, m.msg);
			await delay(500);
			await bot.sendText(`Soretemo... wa ta shi?`, m.msg);
		}else if (m.body == "mt terbaru") {
			const loadingmsg = await bot.reply(loading, m.msg);
			const scrapedData = await scrapeData();
await bot.replyedit(scrapedData, m.msg, loadingmsg.key);
		} else if(m.body.includes("chizu") || m.body.includes("Chizu")){
			return bot.reply(Chizu, m.msg);
		}
		} else{
const pesan1 = `> Mang bajirot jalan ke hora  
> Bajirot pergi, sedihlah minato
> Nyari tempat Top Up Terpercaya?
> Ya cuma di Revanda Store bro`;
const pesan2 = `👥 : Siapa namamu tuan? 
👤 : Namaku Dis!
👥 : Dis apa?
👤 : Disini! Revanda Store tempat Top up Game Termurah & Terpercaya, serba otomatis, anti drama clone & scam🔥`;
const pesan3 = `> Jalan-jalan ke penjara cuervo
> Ke cuervo mengajak adala
> Hari gini masih kena scam bro?
> Top up di web Revanda Store aja laa`;
const pesan4 = `> Kadang-kadang, *"jadi jago"* di game cukup dengan 1 sentuhan. Ga percaya? Cek aja Revanda Store, mau top up sampai beli akun pun ada🔥`;
const pesan5 = `> Iri dengan temen yang udah jago/banyak skin? Tenang, hanya Revanda Store mengerti keadaanmu. Top up termurah, legal, dan terpercaya hanya di Revanda Store🔥`;
const pesan6 = `> Ke kota naga membeli Crysta
> Crysta dibeli, spina habis
Ga itu bukan pantun, cuma mau bilang: Spina mu abis? gasin ke Revanda Store, Anti drama scam & clone🔥`;
const pesanArray = [pesan1, pesan2, pesan3, pesan4, pesan5, pesan6];
const panjangPesan = pesanArray.length;
const pesanAcak = pesanArray[Math.floor(Math.random() * panjangPesan)];

const market1 =`🎮 *Revanda Store: Toram Online* 🎮

${pesanAcak}

*Buy & Sell list:*
- Buy Spina PM Rate
- Sell Spina (https://revandastore.com/games/toram-online)
- Sell Guild Lv. 40 (https://revandastore.com/katalog/9)
- Sell Akun Utama, SERVER: 🇮🇩, 14 Slot, 5 BS (https://revandastore.com/katalog/10)

*Layanan Lain:*
- Top Up ML, FF, PUBG, Valo, dll. termurah di revandastore.com
- Jasa pembuatan custom bot WA
- Sewa bot GC WA Guild Toram (https://revandastore.com/katalog/11)

╔ *${metadata}*
║>> ${hari}, ${jam}:${menit} WIB <<
╚〘 Revanda Store x Chizuru 〙`
if (m.body.includes("revandacd")) {
	const groupId = m.from;
    const triggers = await Trigger.getTriggersByGroupId(groupId);
    if (!triggers.length || await checkCooldown(triggers)) {
		await bot.sendText2(market1);
		if (!triggers.length) {
			await Trigger.addTrigger(groupId, moment().valueOf());
		} else {
			await Trigger.updateTrigger(groupId, moment().valueOf());
		}
	}
} else if(m.body == "grup status"){
	return bot.reply(metadata2, m.msg);
} else if(m.body.includes("chizu") || m.body.includes("Chizu")){
	return bot.reply(`*Chizuru-chan🌸*

Grup ini belum berlangganan Chizu kak,
ketik *grup status* untuk mendapatkan id grup

Info selengkapnya: https://revandastore.com/katalog/11`, m.msg);
}

async function checkCooldown(triggers) {
    const currentTime = moment().valueOf();
    const cooldownDuration = (4) * 60 * 60 * 1000;
    const lastTriggerTime = triggers.length > 0 ? triggers[0].timestamp : null;
    if (lastTriggerTime !== null && (currentTime - lastTriggerTime) > cooldownDuration) {
        return true;
    }
    return false;
}
}} else if (m.from.includes("@s.whatsapp.net")){
			if(["menu", "chizu", "build toram"].some(option => option === m.body)){
				return bot.reply("Chizuru hanya bisa digunakan di grup saja kak", m.msg);
			}
		}
}}		