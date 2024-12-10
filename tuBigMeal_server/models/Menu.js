const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    menuName: String,
    shopName: String,
    rating: String,
    normalPrice: Number,
    specialPrice: Number,
    menuImg: String,
    suggested: String
})

// The name of the model (and the name of the collection in MongoDB will be the plural form, "items").
const menuModel = mongoose.model("Menu", menuSchema);

// you can use itemModel to interact with the "items" collection in MongoDB
module.exports = menuModel;