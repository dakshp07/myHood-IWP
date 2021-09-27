

    //we will create a class of this togllLike button 
    class ToggleLike {

        constructor(toggleElement){

            this.toggler = toggleElement;
            this.toggleLike();//this is the function which will toglle my likes

        }

        toggleLike(){

            $(this.toggler).click(function(clickEvent){

                clickEvent.preventDefault();
                let self = this;
                // console.log("clicked !");

                $.ajax({
                    method : 'GET' ,
                    url : $(self).attr('href')
                }).
                done(function(data){

                    let likesCount = parseInt($(self).attr('data-likes'));//this will get me my likes
                    if(data.data.deleted){

                        likesCount-=1;

                    }else{

                        likesCount+=1;
                    }

                    
                    $(self).attr('data-likes' , likesCount);
                    $(`#like-count-${data.data.likable}-${data.data.type}`).html(`${likesCount}`);

                }).fail(function(err){
                    console.log("error in generating like !" , err);
                })


            })

        }
    }
    $('.like-btn-link').each(function(){
        let self = this;
        let toggleLike = new ToggleLike(self);
    });




