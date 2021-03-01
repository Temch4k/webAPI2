var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

// checks if the password matches up to cu_rulez, if it does then approve the user, and return the user
passport.use(new BasicStrategy(
   function(username,password,done)
   {
       var user = {
           name:"cu_user"
       }
       if (username == user.name && password == "cu_rulez")
       {
           return done(null,user);
       }
       else
       {
           return done(null), false;
       }
   }
));

exports.isAuthenticated = passport.authenticate('basic', {session: false});
