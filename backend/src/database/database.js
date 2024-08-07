import mongoose from "mongoose"
import { DATABASE_NAME } from "../constants.js"


const connectDatabase = async() => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_URL}/${DATABASE_NAME}`)
        console.log(`MongoDB connected successfully. ${connect.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection is failed", error)
    }
}

export default connectDatabase