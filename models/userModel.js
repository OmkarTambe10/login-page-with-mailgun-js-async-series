const mongoose = require("mongoose");
var schema = mongoose.Schema;

var userSchema = new schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    createdon : { type : Date}
});

module.exports = mongoose.model("user", userSchema, "user");