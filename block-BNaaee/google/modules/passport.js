var passport = require("passport");
var User = require("../models/User");

var GitHubStrategy = require("passport-github").Strategy;
var GoogleStrategy = require("passport-google-oauth20").Strategy;


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

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
