import User from "../models/user.model.js";

export async function getMe(req, res) {
	const userId = req.user._id;

	try {
		const user = await User.findById(userId).select("-password -__v");

		if (!user) return res.status(404).json({ error: "User not found" });

		return res.status(200).json({ user });
	} catch (error) {
		console.error("Error in getMe :", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}
