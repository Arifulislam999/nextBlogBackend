const mongoose = require("mongoose");
require("dotenv").config();
let isConnected = false;
const connectDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "blog_with_ai",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
  } catch (error) {
    console.log("db is connected Error");
  }
};
module.exports = connectDB;
