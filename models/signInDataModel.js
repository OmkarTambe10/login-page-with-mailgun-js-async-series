const mongoose = require("mongoose");
var schema = mongoose.Schema;

var userSchema = new schema({
    email : String,
    signInFlag : String,
    emailFlag : String,
    createdon : { type : Date}
});

module.exports = mongoose.model("signInData", userSchema, "signInData");