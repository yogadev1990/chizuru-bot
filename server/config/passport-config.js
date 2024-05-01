import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../database/models/user.model.js"; // Sesuaikan dengan lokasi model user kamu

// Definisikan fungsi konfigurasi Passport.js
function configurePassport() {
    // Konfigurasi strategi local
    // Di passport-config.js

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ where: { username: username } });
            if (!user) {
                return done(null, false, { message: "Invalid username" });
            }
            if (!user.isValidPassword(password)) {
                return done(null, false, { message: "Invalid password" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));


    // Serialisasi dan deserialisasi user
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
    
}

// Ekspor fungsi konfigurasi Passport.js
export default configurePassport;
