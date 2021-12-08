var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
var User = require("../models/User");

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
        profilePic: profile._json.avatar_url,
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

passport.deserializeUser(function (user, done) {
  done(null, user);
});
