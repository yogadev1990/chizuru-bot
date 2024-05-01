import express from "express";
import passport from "passport";

const router = express.Router();

import ControllerLogin from "./login.controller.js";

const controller = new ControllerLogin();

router.get("/", async (req, res) => {
    res.render("dashboard/login", {
		layout: "layouts/login",
	});
});

router.post("/", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login", // Redirect to login page on failure
    failureFlash: true
}));



export default router;
