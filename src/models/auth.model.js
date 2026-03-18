import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username must be unique"],
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        unique: [true, "Email must be unique"],
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    }
})

userSchema.pre("save", async function () {
    if (!this.isModified()) return
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = function (clientPassword) {
    return bcrypt.compare(clientPassword, this.password)
}

const userModel = mongoose.model("User", userSchema)

export default userModel