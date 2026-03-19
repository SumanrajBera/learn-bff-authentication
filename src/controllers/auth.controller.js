import { createSession } from "../bff/web.bff.js";
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

export async function loginController(req, res) {
    const { identifier, password } = req.body;

    let user = await userModel.findOne({
        $or: [
            { email: identifier }, { username: identifier }
        ]
    }).select("+password")

    if (!user) {
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const passwordCheck = await user.comparePassword(password)

    if (!passwordCheck) {
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const sessionId = await createSession(user._id)

    res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        message: "Login succesful"
    })
}

export async function getMeController(req, res) {
    const id = req.user.id

    const user = await userModel.findById(id)

    if (!user) {
        return res.status(40).json({
            message: "User not found"
        })
    }

    return res.status(200).json({
        message: "Working",
        userDets: user
    })
}