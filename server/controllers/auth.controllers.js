import User from "../models/user.model.js";
import { hashPassword } from "../utils/password.utils.js";

export async function registerUser(req, res) {
	const { fullName, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(409).json({ error: "This email is already in use." });
		}

		// hash the user's password;
		const hashedPassword = await hashPassword(password, 12);

		const user = new User({
			fullName,
			email,
			password: hashedPassword,
		});

		await user.save();
		user.password = undefined;

		return res.status(201).json({
			message: "Registration successful.",
			user,
		});
	} catch (error) {
		console.error("Error in registerUser :", error);
		return res.status(500).json({ error: "Internal server error." });
	}
}
