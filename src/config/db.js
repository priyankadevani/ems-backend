const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully", mongoose.connection.host);

    } catch (error) {
        console.error("Error : ", error);
        process.exit(1);
    }
}

module.exports = connectDb;