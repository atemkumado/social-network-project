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
    avatar: String,
    department: Number,
    role: String

});

module.exports = mongoose.model("User", UserSchema);