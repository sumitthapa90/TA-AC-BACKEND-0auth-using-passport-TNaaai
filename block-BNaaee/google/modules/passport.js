var passport = require("passport");
var User = require("../models/User");

var GitHubStrategy = require("passport-github").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var LocalStrategy = require("passport-local").Strategy;

//github
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      var profileData = {
        name: profile.displayName,
        email: profile._json.email,
        username: profile.username,
        profilePik: profile._json.avatar_url,
      };
      User.findOne({ email: profile._json.email }, (err, user) => {
        console.log(err, user);
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
//google

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      var profileData = {
        name: profile.displayName,
        username: profile._json.name,
        email: profile._json.email,
        profilePik: profile._json.picture,
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

//local

passport.use(
  new LocalStrategy(function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "incorrect username" });
      }
      if (!user.verifyPassword(password)) {
        return done(null, false, { message: "incorrect password" });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
