var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = process.env.SECRET_KEY;

// checks if the token matches and if it does then approve the user
passport.use(new JwtStrategy(opts,
    function(jwt_payload,done)
    {
        var user = db.find(jwt_payload.id);

        if (user)
        {
            return done(null,user);
        }
        else
        {
            return done(null, false);
        }
    }
));

exports.isAuthenticated = passport.authenticate('jwt', {session: false});
exports.secret = opts.secretOrKey;
