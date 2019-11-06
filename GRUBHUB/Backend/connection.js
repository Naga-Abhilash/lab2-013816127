const mongoose = require("mongoose");
const URI =
  "mongodb+srv://admin:grubhub_mongo@grubhubdb-jdd7i.mongodb.net/test?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("Could not connect to MongoDB", err);
  }
};

module.exports = connectDB;
