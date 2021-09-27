


    //*****NOTY FLASH MESSAGES *****//
    let sucessFlash = function(message){
        new Noty({
            theme : 'mint' , 
            text: message,
            type: 'alert',
            layout : "topCenter",
            timeout : 1500
            
            }).show();
    }

    let errorFlash = function(message){
        new Noty({
            theme : 'mint' , 
            text: "Post Created",
            type: 'error',
            layout : "topCenter",
            timeout : 1500
            
            }).show();
    }

class PostComments{

    constructor(postId){

        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentsForm = $(`#post-${postId}-comment-form`);

        this.createComment(postId);
        // console.log(postId);
        let self = this ;
        //will fetch all comment delete links inside this post container
        //and on eahc of those a delete function will be called
        
        $(' .comments-delete-btn-link' , this.postContainer ).each(function(){
            self.deleteComment($(this));//ye this comment delete link hai 
        });

    }

    createComment(postId){
        
        let postSelf = this;//jab bhi hahar ka this kisi function mai use karna ho , save it ina  avar
        console.log("hey");
        // if(this.newCommentsForm){
        //     console.log(this.postContainer);
        //     console.log(this.newCommentsForm);
        // }

        this.newCommentsForm.submit(function(defaultEvent){

            defaultEvent.preventDefault();
            let self = this;//this is the form ka this kyuki uska call back call hua hai
            console.log("SBMIT");
            $.ajax({
                method : "POST" ,
                url :  "/comments/create" ,
                data : $(self).serialize(),
                contentType: "application/x-www-form-urlencoded",
                success : function(data){

                   console.log(postId);
                   console.log(data);
                    let newComment = postSelf.newCommentDom(data.data.commentData , data.data.post);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    postSelf.deleteComment($('.comments-delete-btn-link' , newComment));
                    sucessFlash(data.message);
                    new ToggleLike($(' .like-btn-link', newComment));//this means we find a like-btn-link inside of our new commnent

                    
                },
                error : function(data){ 
                    console.log(data.error);
                    errorFlash(data.message);
                }
            })

        })

    }

    
    newCommentDom(comment,post){
        return $(`
        <li id=${comment.Id}>
        <h4>
            ${comment.User}
        </h4>
        <p class="comments-content">
            ${comment.Content}
        </p>

        <a href="/likes/toggle/?id=${comment.Id}&type=Comment" class="like-btn-link" data-likes="${comment.likes.length}">
        <button class='like-btn' ><span id='like-count-${comment.Id}-Comment'> ${comment.likes.length}</span> &nbsp; <i class="fas fa-heart"></i></button>
        </a>
      
        <a href="/comments/destroy/?commentId=${comment.Id}&postAuthor=${post.user}" class="comments-delete-btn-link">
            <button class="comments-delete-btn">Delete</button>
        </a>
     
     </li>
        `);
    }

    deleteComment(commentDeleteLink){ //by link we mean anchor tag

        commentDeleteLink.click(function(defaultEvent){
            defaultEvent.preventDefault();

            $.ajax({

                method : 'GET'  ,
                url :  $(commentDeleteLink).prop('href'),
                success : function(data){
                    $(`#${data.data.commentId}`).remove();
                    sucessFlash(data.message);
                },
                error : function (err){
                    errorFlash(err.responseText);
                }


            })


        })

    }

}

