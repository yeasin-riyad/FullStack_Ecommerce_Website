import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

if(!process.env.MONGODB_URI){
    throw new Error("Missing MONGODB_URI to the environment variable");
}

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected Successfully...");
    } catch(error){
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}
export default connectDB