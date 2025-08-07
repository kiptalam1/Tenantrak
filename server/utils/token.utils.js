import jwt from "jsonwebtoken";

export default function generateCookieAndSendToken(userId, res) {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Lax",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return token;
}
