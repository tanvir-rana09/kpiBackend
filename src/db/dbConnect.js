import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectResponse = await mongoose.connect(process.env.DATABASE_URL);
    const connect = connectResponse.connection;
    connect.on("error", () => {
      console.log("mongo db got some error while connect to datebase");
      process.exit(1);
    });
    connect.on("disconnect", () => {
      console.log("mongo db disconnected");
    });
  } catch (error) {
    console.log("Mongodb connection error :", error);
    process.exit(1);
  }
};

export default connectDB;
