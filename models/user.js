const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    username: {
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
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);