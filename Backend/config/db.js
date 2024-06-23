const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`.blue.italic.bold);
    } catch (error) {
        console.log(`Error: ${error.message}`.red);
        process.exit();
    }
}

module.exports = connectDB;