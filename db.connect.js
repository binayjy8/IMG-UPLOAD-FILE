const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");

const initializeDatabase = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        if(connection) {
            console.log("Database connected successfully");
        }
    } catch(error) {
        console.log("Error connecting to the database:", error);
    }
}

module.exports = {initializeDatabase};