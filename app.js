const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose"); //NoSQL database
var bodyParser = require('body-parser');
var route = require("./routes/user.js");
//connection of server on port no.9000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set('view engine', 'ejs')
app.use("/route/user", route);


//connection of NoSQL database
mongoose.connect('mongodb://127.0.0.1/dashboard', { useUnifiedTopology: true, useNewUrlParser: true }, function(error, db){
    if(error){
        console.log(error);
    }else{
        app.listen( port, function(){
            console.log("Connected to port " + port );
        });    
    }
});
module.exports = app;