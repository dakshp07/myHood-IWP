const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err,user){
        return res.render('profile',{
            title: 'profile',
            profile_user:user
        });
    });
}

module.exports.update = async function(req,res){
    if(req.user.id == req.params.id){
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log("**** MULTER ERROR ****",err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    // this is saving the path of the uploaded file into the avatar feild in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        } catch (error) {
            req.flash('error',err);
            return res.redirect('back');
        }
    } else {
        req.flash('error',"Unauthorized");
        return res.status(401).send('Unauthorized');
        // return res.redirect('back');
    }
}

module.exports.settings = function(req,res){
        return res.render('settings',{
        title: 'settings',
    })
}

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
        return res.render('user_sign_up',{
        title: 'Sign Up',
    })
}

module.exports.signIn = function(req,res){
        if(req.isAuthenticated()){
        return res.redirect('/users/profile');
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
    req.flash('success','Logged in Succesfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','You have logged out');
    return res.redirect('/');
}