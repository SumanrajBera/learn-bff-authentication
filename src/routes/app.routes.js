import { Router } from "express";
import { registerController } from "../controllers/auth.controller.js";
import { registerValidate } from "../validators/auth.validator.js";

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @body username, email and password
 */
authRouter.post("/register", registerValidate(), registerController)

export default authRouter