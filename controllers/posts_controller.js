const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id,
        });

        if(req.xhr){
            return res.status(200).json({
                data:{
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success','posted successfully');
        return res.redirect('back');
    } catch (error) {
        req.flash('error',err);
        console.log('Error',error);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){

    try {
        let post = await Post.findById(req.params.id);
        //.id means converting object id into string
        if(post.user == req.user.id){
            post.remove();
    
            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id,
                        name: req.params.name,
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success','posted deleted');
            return res.redirect('back');
        } else {
            req.flash('error','You cannot delete this post');
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error',err);
        console.log('Error',error);
        return res.redirect('back');
    }
}