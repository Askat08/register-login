const LocalStragedy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load User Model
const User = require("../models/Users");

module.exports = function(passport) {
  passport.use(
    new LocalStragedy({ usernameField: "email" }, (email, password, done) => {
      // Match User
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: "That email is not registered"
            });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              done(null, false, { message: "Email or Password incorrect" });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );

  // Serializing user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserializing user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
