class chatEngine{

    constructor(chatBoxId , userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000', { transport : ['websocket'] });

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    createMessagePill(data){

        let senderMail = data.user_email;
        let msg = data.msg
        console.log("create");
        let messageType = 'other-message' ;
        if(senderMail === this.userEmail){
            messageType = 'self-message';
        }

        return $(`
        <li class="${messageType}">
            <span>${msg}</span>
            <div class="user-mail">${senderMail}</div>
        </li>
        `)

    }

    connectionHandler(){

        let self = this;

        //1this will bascially fire an even to establish our conection
        this.socket.on('connect' , function(){
            console.log("connection using sockets !");
            
            //1)what we do is that we emit an event('join_room') from the front end which will tell the backend that a user wants to join a vhat room
            //along with the emit we send some data 
            //this req will be recived at the baackdend chat_socket
            self.socket.emit('join_room' , {
                user_email : self.userEmail,
                chat_room : 'codial'
            });

            //4)we confiem if a user has joned the room
            self.socket.on('user_joined' , function(data){
                console.log("user joined " , data);
            })

            //whenver the send messga button is clicked and even is fired which send the messga e to the server
            $('#send-message').click(function(){

                let message = $('#chat-message-input').val();

                if(message != ''){

                    self.socket.emit('send_message' , {
                        user_email : self.userEmail,
                        chat_room : 'codial',
                        msg : message
                    });
                    $('#chat-message-input').val("");
                   
                }


            })

            //we create an event detected on to recieve messages 
            self.socket.on('receive_message' , function(data){

                console.log('message recved !' , data.msg);
                let messagePill = self.createMessagePill(data);
                $(".chat-messages-list").append(messagePill);

            })

        });

    }

}