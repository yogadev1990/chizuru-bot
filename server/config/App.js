import express from "express";
import expressLayout from "express-ejs-layouts";
import flash from "connect-flash";
import session from "express-session";
import fileUpload from "express-fileupload";
import passport from "passport";
import passportConfig from "./passport-config.js";
import MySQLStore from 'express-mysql-session';

const MySQLStoreSession = MySQLStore(session);

const options = {
    host: 'localhost',
    port: 3306,
    user: 'torampe1_admin2',
    password: 'yogaart1990',
    database: 'torampe1_chizugateway',
    schema: {
        tableName: 'main_session',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

const sessionStore = new MySQLStoreSession(options);

// import { connectDatabase } from "./Database.js";
import routerLogin from "../router/login/login.router.js";
import routerUser from "../router/session/session.router.js";
import routerDashboard from "../router/dashboard/dashboard.router.js";
import routerApi from "../router/api/api.router.js";
import routerAutoReply from "../router/dashboard/AutoReply/autoReply.router.js";

class App {
	constructor() {
		this.app = express();
		this.plugins();
		this.route();
		this.PORT = process.env.PORT || 8080;
	}

	plugins() {
		this.app.set("trust proxy", 1);
		this.app.set("view engine", "ejs");
		this.app.use(expressLayout);
		this.app.use(express.static("public/mazer"));
		this.app.use(express.static("public"));
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.json());

        this.app.use(session({
            key: 'session_cookie_name',
            secret: 'session_secret',
            store: sessionStore,
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
        }));

		this.app.use(flash());
		this.app.use(function (req, res, next) {
			res.locals.success_msg = req.flash("success_msg");
			res.locals.error_msg = req.flash("error_msg");
			res.locals.side = req.flash("side");
			res.locals.url = req.originalUrl;
			next();
		});
		this.app.use(
			fileUpload({
				fileSize: 10 * 1024 * 1024,
			})
		);

        this.app.use(passport.initialize());
        this.app.use(passport.session());
        passportConfig(passport); // Inisialisasi Passport.js
	}

	route() {
		this.app.get("/", (req, res) => {
			res.redirect("/login");
		});
		this.app.use("/login", routerLogin);
		this.app.use("/dashboard", routerDashboard);
		this.app.use("/session", routerUser);
		this.app.use("/api", routerApi);
		this.app.use("/reply", routerAutoReply);
	}
}

export default App;
