const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    constent:{
        type: String,
        required: true
    },
    use:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
},{
    timestamps: true
});

const Post = mongoose.model('Post',postSchema);
module.exports = Post;