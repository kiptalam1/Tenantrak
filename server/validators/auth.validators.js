import { checkSchema } from "express-validator";

const acceptedDomains = ["gmail.com", "yahoo.com", "outlook.com"];

export const registerValidator = checkSchema({
	fullName: {
		trim: true,
		notEmpty: {
			errorMessage: "Full name is required",
		},
		isLength: {
			options: { min: 3 },
			errorMessage: "Full name must be at least 3 characters long",
		},
	},

	email: {
		trim: true,
		normalizeEmail: true,
		notEmpty: {
			errorMessage: "Email is required",
		},
		isEmail: {
			errorMessage: "Invalid email format",
		},
		custom: {
			options: (value) => {
				const regex =
					/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
				if (!regex.test(value)) {
					throw new Error(
						"Only gmail.com, yahoo.com, or outlook.com addresses are allowed"
					);
				}
				return true;
			},
		},
	},

	password: {
		trim: true,
		notEmpty: {
			errorMessage: "Password is required",
		},
		isLength: {
			options: { min: 8 },
			errorMessage: "Password must be at least 8 characters",
		},
		matches: {
			options: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/],
			errorMessage:
				"Password must include upper, lower, number, and special character",
		},
	},
});
