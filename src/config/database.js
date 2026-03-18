import mongoose from "mongoose";

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB")
    } catch (err) {
        console.log("Couldn't Connect to DB")
    }
}

export default connectToDB