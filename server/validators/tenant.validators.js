import { checkSchema } from "express-validator";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const tenantValidators = checkSchema({
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
		optional: { options: { nullable: true, checkFalsy: true } },
		trim: true,
		normalizeEmail: true,
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
	phone: {
		custom: {
			options: (value, { req }) => {
				// Default country if user provides local format
				const country = req.body.country || "KE"; // ISO 3166-1 Alpha-2 code

				const phoneNumber = parsePhoneNumberFromString(value, country);

				if (!phoneNumber || !phoneNumber.isValid()) {
					throw new Error("Invalid phone number");
				}

				// Normalize to E.164 format before it hits your controller
				req.body.phone = phoneNumber.number; // +254707444645
				return true;
			},
		},
	},
});
