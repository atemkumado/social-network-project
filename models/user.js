const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    faculty:String, //faculty Name
    avatar: String,
    department: Number,//faculty ID 
    role: String

});

module.exports = mongoose.model("User", UserSchema);