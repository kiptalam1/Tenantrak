import mongoose from "mongoose";
import Building from "../models/building.model.js";
import User from "../models/user.model.js";
import Landlord from "../models/landlord.model.js";

export async function createBuilding(req, res) {
	const { name } = req.body;
	const userId = new mongoose.Types.ObjectId(req.user.userId);

	if (!name?.trim()) {
		return res.status(400).json({ error: "Building name is required" });
	}

	try {
		// 1️⃣ Check if user is an owner
		const user = await User.findOne({ _id: userId, role: "owner" }).lean();
		if (!user) {
			return res
				.status(403)
				.json({ error: "Only owners can register properties" });
		}

		// 2️⃣ Insert directly — unique index with collation enforces case-insensitivity
		const newBuilding = await Building.create({
			buildingName: name.trim(),
			landlord: userId,
		});

		return res.status(201).json({
			message: "Building created successfully",
			building: newBuilding,
		});
	} catch (error) {
		if (error.code === 11000) {
			return res.status(400).json({ error: "This property already exists" });
		}

		console.error("Error in createBuilding", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function getBuildings(req, res) {
	const userId = req.user.userId;

	try {
		// find the user's landlord id;
		const landlord = await Landlord.findOne({ user: userId })
			.select("_id user")
			.lean();
		if (!landlord) return res.status("Landlord not found");
		if (landlord.user.toString() !== userId)
			return res
				.status(403)
				.json({ error: "You can only access your property" });

		// fetch landlord's buildings using landlord's id
		const buildings = await Building.find({ landlord: landlord._id })
			.select("buildingName")
			.lean();

		// then return buildings
		res.status(200).json({ buildings });
	} catch (error) {
		console.error("Error in getBuildings :", error.message);
		return res.status(500).json({ error: "Internal server error" });
	}
}