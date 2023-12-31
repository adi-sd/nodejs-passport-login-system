const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUSerByEmail, getUserByID) {
    const authenticateUser = async (email, password, done) => {
        const user = getUSerByEmail(email);
        console.log(user);
        if (user == null) {
            return done(null, false, { message: "No user found with that email!" });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Incorrect password!" });
            }
        } catch (error) {
            return done(error);
        }
    };
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
            },
            authenticateUser
        )
    );
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        done(null, getUserByID(id));
    });
}

module.exports = initialize;
