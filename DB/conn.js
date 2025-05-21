const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGOURL = process.env.MONGO_URL;
const connection = mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

module.exports = connection;
