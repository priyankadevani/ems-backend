const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const PORT = process.env.PORT || 5001;

const connectDb = require("./config/db");
const startServer = async () => {
    await connectDb();
    //adding a host("0.0.0.0") in listen while deployment it allows any ip to connect to the server
    app.listen(PORT, "0.0.0.0", () => {
        console.log("Server is running on port : ", PORT);
    });
}

startServer();


