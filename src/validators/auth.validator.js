import { body, validationResult } from "express-validator";

function validate(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.mapped()
        })
    }

    next()
}

export function registerValidate() {
    return [
        body("username")
            .notEmpty()
            .withMessage("Username can't be empty"),

        body("email")
            .notEmpty()
            .withMessage("Email can't be empty")
            .isEmail()
            .withMessage("Email isn't valid"),

        body("password")
            .notEmpty()
            .withMessage("Password can't be empty")
            .isLength({ min: 6 })
            .withMessage("Password must of atleast 6 length"),

        validate
    ]
}