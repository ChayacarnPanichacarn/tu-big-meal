const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try{
        const mongoURI = process.env.MONGO_URI;
        const conn = await mongoose.connect(process.env.mongoURI);
        console.log(`MongoDB Connected`)
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;
