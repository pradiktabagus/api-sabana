var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcryptjs");
var User = require("../model/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Local Strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email })
      .then((user) => {
        console.log(user);
        //Create New User
        if (!user) {
          const newUser = new User({ email, password });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  return done(null, user);
                })
                .catch((err) => {
                  return done(null, false, { message: err });
                });
            });
          });
        } else {
          //Match Password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Wrong password" });
            }
          });
        }
      })
      .catch((err) => {
        return done(null, false, { message: err });
      });
  })
);
// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "user[email]",
//       passwordField: "user[password]",
//     },
//     function (email, password, done) {
//       User.findOne({ email: email })
//         .then(function (user) {
//           if (!user || !user.validPassword(password)) {
//             return done(null, false, {
//               errors: { "email or password": "is invalid" },
//             });
//           }
//           return done(null, user);
//         })
//         .catch(done);
//     }
//   )
// );

module.exports = passport;
