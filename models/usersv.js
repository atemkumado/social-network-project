const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        require: true
    },

    name: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
    },
    class: {
        type: String,

    },
    role: {
        type: String,

    },

});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Usersv", UserSchema);