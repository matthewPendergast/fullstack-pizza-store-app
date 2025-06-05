import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateSignup = [
	body("name").trim().notEmpty().withMessage("Name is required."),
	body("email").isEmail().withMessage("A valid email is required."),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long."),
	handleValidationErrors,
];

export const validateLogin = [
	body("email").isEmail().withMessage("A valid email is required."),
	body("password").notEmpty().withMessage("Password is required."),
	handleValidationErrors,
];

function handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({
			errors: errors.array().map((err) => ({
				field: (err as any).param,
				message: err.msg,
			})),
		});
		return;
	}
	next();
}

