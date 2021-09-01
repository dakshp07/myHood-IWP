const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/codial_development')
const db =  mongoose.connection;

db.on('error',console.error.bind(console,"error occured"));
db.once('open',()=>{
    console.log('databse is connected');
});

module.exports = db;