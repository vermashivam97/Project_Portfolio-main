let LocalStrategy = require("passport-local").Strategy;

// Load User model
let User = require("../models/users");

module.exports = function (passport) {
  console.log('passport entered..');
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      (username, password, done) => {
        // Match user
        User.findOne({
          username: username,
        }).then((user) => {
          console.log(user.username);
          console.log(user.password);
          console.log(password);
          if (!user) {
            console.log('not user..');
            return done(null, false, {
              message: "That username or password is incorrect",
            });
          }
          if (user && password !== user.password) {
            console.log(password);
            //console.log(user.password);
            return done(null, false, {
              message: "Incorrect Password",
            });
          }
          return done(null, user);
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};