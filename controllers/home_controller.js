const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req,res){
    console.log(req.cookies);

    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title: 'Home',
    //         posts: posts
    //     });
    // });

    //populate the user of each post
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err,posts){
        User.find({},function(err,users){
            return res.render('home',{
                title: 'Home',
                posts: posts,
                all_users: users
            });
        });
    });
}