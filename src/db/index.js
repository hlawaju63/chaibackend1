import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import util from "util"

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
   // console.log(`\n MongoDB Connected !! DB HOST ::: ${util.inspect(connectionInstance, { depth: null })}`);


    console.log(
      `\n MongoDB Connected !! DB HOST :: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection Error : " + error);
    process.exit(1);
  }
};

export default connectDB;
