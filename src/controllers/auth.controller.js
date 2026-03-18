import userModel from "../models/auth.model.js";

export async function registerController(req, res) {
    const { username, email, password } = req.body

    const alreadyExist = await userModel.findOne({
        $or: [
            { username }, { email }
        ]
    })

    if (alreadyExist) {
        const field = alreadyExist.email === email ? "Email" : "Username"
        return res.status(400).json({
            message: `${field} already exists`
        })
    }

    let user = await userModel.create({
        username,
        email,
        password
    })

    res.status(201).json({
        message: "User registration successful",
        user: {
            username: user.username,
            email: user.email
        }
    })
}