const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    shopName: String,
    shopOwner: String,
    canteen: String,
    shopDetail: String,
    dateTime: String,
    category: String,
    shopImg: String,
    adsImg: String,
    delivery: String
})

const shopModel = mongoose.model("Shop", shopSchema);

module.exports = shopModel;