const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    },
    function (req, email, password, done) {
        //find a user and establish identity
        User.findOne({email: email},function(err,user) {
            if(err) {
                req.flash('error',err);
                return done(err);
            }
            if(!user || user.password != password) {
                req.flash('error', 'Invalid username/password');
                return done(null, false);
            }
            return done(null, user);
        });
    }
));

//serialising the user to decide which key is to be kept in the cookies
passport.serializeUser((user, done) => {
    done(null,user.id);
});

//deserializing the User from the key in the cookies
passport.deserializeUser((id, done) =>{
    User.findById(id,(err,user)=>{
        if(err){
            console.log('error in finding the user --> passport');
            return done(err);
        }
        return done(null, user)
    })
});

//check if user is authenticated
passport.checkAuthentication = function(req,res,next) {
    // if the user is signed in then pass on the request to the next function(controllers's action)
    if (req.isAuthenticated()){
        return next();
    }
    // if user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
        if (req.isAuthenticated()){
        //req user contains the current signned in user from the session cookie and we are sending to the locals for views
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;