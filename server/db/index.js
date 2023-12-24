const mongoose = require("mongoose");

exports.dbConnect = async function () {
  try {
    // await mongoose.connect("mongodb://54.201.160.69:58173/Behive");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("connected to MongoDB", process.env.MONGO_URI);
  } catch (error) {
    console.log("Error connecting to Mongo:", error);
  }
};
