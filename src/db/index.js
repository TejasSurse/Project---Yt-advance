import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try{
      const connectionInstance =   await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      console.log(`\n MongoDB Connection ! DB HOST : ${connectionInstance.connection.host}`);
    }catch(err){
        console.log("MongoDB Connection Error", err);
        process.exit(1); // corrent aplicaion process reference (There are many codes )
    }
}


export default connectDB;