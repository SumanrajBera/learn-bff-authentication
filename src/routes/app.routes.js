import { Router } from "express";
import { getMeController, loginController, registerController } from "../controllers/auth.controller.js";
import { loginValidate, registerValidate } from "../validators/auth.validator.js";
import { verifyAuth } from "../bff/web.bff.js";

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @body username, email and password
 */
authRouter.post("/register", registerValidate(), registerController)


/**
 * @route POST /api/auth/login
 * @body username or email and password
 */
authRouter.post("/login", loginValidate(), loginController)

/**
 * @route GET /api/auth/getMe
 * @body empty
 */
authRouter.get("/getMe", verifyAuth, getMeController)

export default authRouter