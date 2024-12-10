const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    gmail: String,
    password: String,
    userName: String,
    firstName: String,
    lastName: String,
    phoneNum: String,
    address: String,
    profilePic: String,
    role: String,
    favourite: [{
        shopName: String,
        menuName: String
    }]
})

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;