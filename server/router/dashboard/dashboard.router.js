import fs from "fs";
import express from "express";
import SessionDatabase from "../../database/db/session.db.js";
import { AutoReply } from "../../database/db/messageRespon.db.js";
import HistoryMessage from "../../database/db/history.db.js";
const router = express.Router();

const { SESSION_PATH, LOG_PATH } = process.env;

const db = new SessionDatabase();
// middleware untuk memeriksa apakah pengguna sudah login
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // lanjutkan ke halaman berikutnya jika pengguna sudah login
    }
    // Jika pengguna belum login, redirect ke halaman login
    res.redirect("/login");
};


router.get("/", ensureAuthenticated,  async (req, res) => {
	let sessionCheck = fs.readdirSync(SESSION_PATH).filter((x) => x != "store")[0];
	let session_name = sessionCheck ? sessionCheck : null;
	let loggerPath = fs.existsSync(`${LOG_PATH}/${session_name}.txt`) ? `${LOG_PATH.replace("./public/", "")}/${session_name}.txt` : null;
	const session = session_name ? await db.findOneSessionDB(session_name) : null;
	res.render("dashboard/dashboard", {
		loggerPath,
		session,
		session_name,
		layout: "layouts/main",
	});
});

router.get("/send-message", ensureAuthenticated, async (req, res) => {
	const session = await db.findAllSessionDB();
	res.render("dashboard/sendMessage", {
		session,
		layout: "layouts/main",
	});
});

router.get("/auto-reply", ensureAuthenticated, async (req, res) => {
	const session = await db.findAllSessionDB();
	const replyList = await new AutoReply().checkReplyMessage();
	res.render("dashboard/autoReply", {
		session,
		replyList,
		layout: "layouts/main",
	});
});

router.get("/api-doc", ensureAuthenticated, async (req, res) => {
	res.render("dashboard/apidoc", {
		layout: "layouts/main",
	});
});

router.get("/history-message", ensureAuthenticated, async (req, res) => {
	let db = await new HistoryMessage().getAllMessage();
	res.render("dashboard/history", {
		layout: "layouts/main",
		db,
	});
});

export default router;
