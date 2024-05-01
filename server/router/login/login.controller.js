import passport from "passport";

class LoginController {
    // Metode untuk logout
    logout(req, res) {
        req.logout();
        res.redirect("/");
    }
}

export default LoginController;
