{


    //*****INTERACTIVITY*******//

    /*COMMENT SECTION*/
    //will handle button clicks
  
    // will expa comments of posts added using ajax
    let expandComment = function(commentBtn){
        commentBtn.click(function(event){
            event.preventDefault();
            event.stopPropagation();
            // console.log(this.getAttribute("post-id"))
            var commentId = this.getAttribute("post-id");
            var temp = "comment-section-";
            commentId = temp+commentId;
            var commentSection = document.getElementById(commentId);    
            commentSection.classList.toggle("hidden");
            if(this.innerText == "Comments"){
                this.innerText = "Show Less";
            }else{
                this.innerText = "Comments"
            }
        })
    }

    let commentDisplayBtns = $('.comments-btn');
        // console.log(commentDisplayBtns);
    for(let i = 0 ; i<commentDisplayBtns.length  ; i++){

            expandComment($(commentDisplayBtns[i]));

    }


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
  
    
//********** AJAX CALLS*******//

    //methdo to create a post using ajax
    function createPost(){

        //we get the form  and prevent the defualt behavior off its submit button
        var newPostForm = $('#form-posts');
        // console.log(newPostForm);
        newPostForm.submit(function(defaultEvent){
            // console.log(defaultEvent);

            defaultEvent.preventDefault();

            $.ajax({
                url : "/posts/create",
                method:"POST",
                data: newPostForm.serialize(), //this converts the foem data into json
                success : function(data){
                    //data recooved from the api call
                    // console.log(data); //ajax req by jquery will parse the string dat into json itslef
                    let newPost = newPostDom(data.data.post , data.data.userName);
                    $("#posts-display-wrapper").prepend(newPost );
                    //adding this function to delete post fucn to it can be deleted usin ajax
                    deletePost($(' .delete-post-btn-link' , newPost));

                    new PostComments(data.data.post._id);
                    //this will enable the comment section to be dynamic
                    expandComment($(`#btn-${data.data.post._id}`));
                    //shows flash message
                    sucessFlash("Post Created !");
                    new ToggleLike($(' .like-btn-link', newPost));//bind the new like button of this post to this clas
    
                   
                },
                error: function(error){
                    console.log(error.responseText);
                    errorFlash(err.responseText);
                }
            });

        });

    }

    //methdo to create post in dom
    let newPostDom = function(post , userName){
            
        return $(`
        <div class="posts-display" id="post-${post._id}">
            <h3>
                ${ userName }
            </h3>
            <p class="post-content">
            
                ${post.content}
            </p>
            <div class='post-btns'>
            
            <a href="/likes/toggle/?id=${post._id}&type=Post" class="like-btn-link" data-likes="${post.likes.length}">
                <button class='like-post-btn' ><span id="like-count-${post._id}-Post">${post.likes.length}</span> &nbsp <i class="fas fa-heart"></i></button>
            </a>
                <button class='comments-btn new-posts-btn ' post-id="${post._id}" id="btn-${post._id}" >Show Less</button>
        
        
                    <a href="/posts/destroy/${post._id}" class='delete-post-btn-link'>
                    <button class='delete-post-btn' >Delete</button>
                    </a>
                
            </div>

            <div class="post-comments" id="comment-section-${post._id}" >
           
                <form action="/comments/create" method="POST" class="comment-form comment-form-preloaded" id="post-${post._id}-comment-form">
                <input type="text" name="content" placeholder="Add a comment !" required>

               
                <input type="hidden" name="post" value="${post._id}"> 
                <input type="submit" value="POST" class="post-comment-btn">
                </form>
           
        
            <div class="post-comments-list " id="post-comments-wrapper-${post._id}">
        
                <ul id="post-comments-${post._id}">
                    <li>
                    </li>
                </ul>
        
            </div>
        </div>
        
            
        
        </div>`)

        

    }


    let deletePost = function(deleteLink){

     
        deleteLink.click(function(event){
          
            //prevent default behaviour of the thing
            event.preventDefault();

            //now do the ajax request
            $.ajax({
                type:'get' ,
                url: $(deleteLink).prop('href') ,//will give the href of the anchor tag
                success : function(data){
                    // console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                    sucessFlash("Post and Associated Comments Deleted");
                },error : function(err){
                    console.log(err.responseText);
                    errorFlash(err.responseText);
                }

            })
        
        
        });

    }

    let deletePost2 = function(deleteLink){

     
      
            //now do the ajax request
            $.ajax({
                type:'get' ,
                url: $(deleteLink).prop('href') ,//will give the href of the anchor tag
                success : function(data){
                    // console.log(data);
                    $(`#post-${data.data.post_id}`).remove(); //cout<<"post-"<<var
                    sucessFlash("Post and Associated Comments Deleted")
                },error : function(err){
                    errorFlash(err.responseText);
                    console.log(err.responseText);
                }

            })
        


    }


    let postDeleteLinks = document.getElementsByClassName('delete-post-btn-link');
    for(let i = 0 ; i < postDeleteLinks.length ; i++){
        postDeleteLinks[i].addEventListener('click' , function(event){
            event.preventDefault();
            deletePost2( postDeleteLinks[i]);
        });
        // deletePost( postDeleteLinks[i] );
    }

    /************* COMMENTS ************/

 
    let convertPostsToAjax=function(){

        $('.posts-display').each(function(){

            let self = $(this); //this is a post container created in ajax format
        
            let postId = self.prop('id').substr(5);
            // console.log(postId);
            new  PostComments(postId);

        });

    }   

    convertPostsToAjax();
    createPost();
    


}