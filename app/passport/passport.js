var FacebookStrategy = require('passport-facebook').Strategy;
var User             = require('../models/users');
var session          = require('express-session');
var jwt              = require('jsonwebtoken');
var secret           = 'No-Girlfriend-Since-Birth';


module.exports = function (app, passport) {
     
    app.use(passport.initialize()); 
    app.use(passport.session());
    app.use(session({secret: 'Chill-Chill-Fm', resave: false, saveUninitialized: true, cookie: { secure: false }
    }));

      
    passport.serializeUser(function(user, done) {
        token = jwt.sign({id: user._id, username: user.username, email: user.email, age: user.age, address: user.address, status: user.status, img:user.img, usertype: user.usertype}, secret, { expiresIn: '24h' });
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use(new FacebookStrategy({
        clientID: '1891166074537727',
        clientSecret: '37c2213f1720fbf2a7d13d0f38eb7725',
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'picture.type(large)', 'email']
        },
                                  
        function(accessToken, refreshToken, profile, done) {
        User.findOne({'email': profile._json.email}, function(err,user) {
            if(err){ 
                return done(err);
            }else if(user){           
                return done(null, user);
            }else{
                var newUser = new User();
                
                newUser.username = profile.displayName;
                newUser.email    = profile.emails[0].value;
                newUser.img      = profile.photos[0].value;
                
                 newUser.save(function(err, user) {
                     if(err){
                         throw err;
                     }else{
                         return done(null, user);
                     }
                 });
                
            }
        
        });
                  
        }
    )); 
    
     
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login' }), function (req, res) {
            res.redirect('/facebook/'+ token);     

    });

    return passport;
}