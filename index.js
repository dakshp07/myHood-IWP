const express = require('express');
var cookieParser = require('cookie-parser')
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'))
app.use(expressLayouts);
//extract induvidual stye and scripts into the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//setup the view engine
app.set('view engine', 'ejs');
app.set('views','./views');

//use to create a session for user
app.use(session({
    name: 'myhood',
    //to do change secret before deployment in prod mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/codial_development',
            // client: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//use express routers
app.use('/',require('./routes'));

app.listen(port,function(err) {
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is Running On Port : ${port}`);
});