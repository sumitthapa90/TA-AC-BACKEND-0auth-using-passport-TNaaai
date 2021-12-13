var passport = require("passport");

var GitHubStrategy = require("passport-github").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;

var User = require("../models/User");

//github

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      var profileData = {
        email: profile._json.email,
      };

      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);

        if (!user) {
          User.create(profileData, (err, addUser) => {
            if (err) return done();
            return done(null, addUser);
          });
        }
        done(null, user);
      });
    }
  )
);

//google

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      var profileData = {
        email: profile._json.email,
      };

      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(profileData, (err, addUser) => {
            if (err) return done(err);
            return done(null, addUser);
          });
        }
        done(null, user);
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
