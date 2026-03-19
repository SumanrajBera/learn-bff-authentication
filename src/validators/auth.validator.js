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
            .withMessage("Username can't be empty")
            .isLength({min: 4})
            .withMessage("Username can't be smaller than 4 chars"),

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

export function loginValidate() {
    return [
        body("identifier")
            .notEmpty()
            .withMessage("Email or Username can't be empty")
            .custom((value) => {
                // check if it's email
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

                if (isEmail) return true;

                // else treat as username
                if (value.length > 3) return true;

                throw new Error("Enter a valid email or username");
            }),

        body("password")
            .notEmpty()
            .withMessage("Password can't be empty"),

        validate
    ];
}