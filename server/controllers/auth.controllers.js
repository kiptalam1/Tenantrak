import User from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/password.utils.js";
import generateCookieAndSendToken from "../utils/token.utils.js";

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

export async function loginUser(req, res) {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email }).select(
			"password fullName email role createdAt"
		);

		if (!user) {
			return res.status(404).json({ error: "User not found. Please signup" });
		}

		const isMatch = await comparePassword(password, user.password);

		if (!isMatch) {
			return res.status(403).json({ error: "Wrong password." });
		}

		const token = generateCookieAndSendToken(user._id, res); // Sends cookie too

		return res.status(200).json({
			message: "Login successful.",
			token,
			user: {
				id: user._id,
				fullName: user.fullName,
				email: user.email,
				role: user.role,
				createdAt: user.createdAt,
			},
		});
	} catch (error) {
		console.error("Error in loginUser:", error);
		return res.status(500).json({ error: "Internal server error." });
	}
}
