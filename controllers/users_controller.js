
const User = require('../models/user');

module.exports.profile = function(req,res){
    return res.render('profile',{
        title: 'profile',
    })
}

module.exports.settings = function(req,res){
        return res.render('settings',{
        title: 'settings',
    })
}

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
        return res.render('user_sign_up',{
        title: 'Sign Up',
    })
}

module.exports.signIn = function(req,res){
        if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
        return res.render('user_sign_in',{
        title: 'Sign In',
    })
}

//get sign up databse
module.exports.create = function(req,res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
        // return res.render('/');
    }
    User.findOne({email: req.body.email},(err,user)=>{
        if (err){
           console.log('error in finding user in siging up');
           return; 
        }
        if(!user){
            User.create(req.body,(err,user)=>{
                if(err){
                    console.log('error in creating user while siging up');
                    return;
                }
                return res.redirect('/users/sign-in');
                // return res.render('/users/sign-in')
            })
        } else {
            return res.redirect('back');
            // return res.render('/')
        }
    })
}
//sign in and create session for user
module.exports.createSession = function(req,res){
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();
    return res.redirect('/');
}