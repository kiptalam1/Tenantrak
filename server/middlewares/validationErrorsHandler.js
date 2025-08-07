import { validationResult } from "express-validator";

export function handleValidationErrors(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const messages = errors.array().map((err) => err.msg);
		return res.status(400).json({ error: messages[0] });
	}
	next();
}
