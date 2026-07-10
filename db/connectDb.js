const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONOGO_URI);
    if (connection) {
      console.log("susesfully connected to db");
    }
  } catch (error) {
    console.log("failed to connect db.");
    console.error(error);
  }
};
module.exports = { connectDb };
