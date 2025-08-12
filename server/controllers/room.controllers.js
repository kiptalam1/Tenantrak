import mongoose from "mongoose";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Landlord from "../models/landlord.model.js";
import Building from "../models/building.model.js";

export async function createRoom(req, res) {
	const { roomName, roomType, status, bed, bath, price, buildingName } =
		req.body;
	const userId = new mongoose.Types.ObjectId(req.user.userId);

	if (!buildingName?.trim()) {
		return res.status(400).json({ error: "Building name is required" });
	}
	if (!roomName?.trim()) {
		return res.status(400).json({ error: "Room name is required" });
	}

	try {
		// 1️⃣ Validate user role
		const user = await User.findOne({ _id: userId, role: "owner" }).lean();
		if (!user) {
			return res
				.status(403)
				.json({ error: "Only owners can register properties" });
		}

		// 2️⃣ Get landlord document
		const landlord = await Landlord.findOne({ user: userId });
		if (!landlord) {
			return res.status(404).json({ error: "Landlord profile not found" });
		}

		const trimmedBuildingName = buildingName.trim();

		// 3️⃣ Check if building exists for landlord
		let building = await Building.findOne({
			landlord: landlord._id,
			buildingName: { $regex: `^${trimmedBuildingName}$`, $options: "i" },
		});

		// 4️⃣ Create building if not found
		if (!building) {
			building = new Building({
				buildingName: trimmedBuildingName,
				landlord: landlord._id,
			});
			await building.save();

			// Append building to landlord.buildings
			await Landlord.updateOne(
				{ _id: landlord._id },
				{ $addToSet: { buildings: building._id } }
			);
		}

		// 5️⃣ Check if room exists
		const existingRoom = await Room.findOne({
			building: building._id,
			roomName: { $regex: `^${roomName.trim()}$`, $options: "i" },
		});

		if (existingRoom) {
			return res
				.status(400)
				.json({ error: "This room already exists in this building" });
		}

		// 6️⃣ Create room
		const newRoom = new Room({
			roomName: roomName.trim(),
			roomType,
			status,
			bed,
			bath,
			price,
			building: building._id,
		});
		await newRoom.save();

		// Append room to building
		await Building.updateOne(
			{ _id: building._id },
			{ $addToSet: { rooms: newRoom._id } }
		);

		return res.status(201).json({
			message: "Room created successfully",
			room: newRoom,
			building,
		});
	} catch (error) {
		console.error("Error in createRoom", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}


export async function getAllRooms(req, res) {
	const userId = req.user.userId;

	try {
		const landlord = await Landlord.findOne({ user: userId })
			.populate({
				path: "buildings",
				select: "buildingName address",
				populate: {
					path: "rooms",
					select: "roomName roomType tenants status bath bed price",
					populate: {
						path: "tenants",
						select: "fullName",
					},
				},
			})
			.lean();

		if (!landlord) {
			// User exists but no landlord profile, return empty rooms array
			return res.status(200).json({ rooms: [] });
		}

		// Flatten rooms with building info for easy frontend consumption
		const rooms = landlord.buildings.flatMap((building) =>
			(building.rooms || []).map((room) => ({
				...room,
				buildingName: building.buildingName,
				address: building.address || "",
			}))
		);

		return res.status(200).json({ rooms });
	} catch (error) {
		console.error("Error in getAllRooms", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function deleteRoom(req, res) {
	const userId = req.user.userId;
	const id = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ error: "Invalid room ID" });
	}

	try {
		const landlordExists = await Landlord.findOne({ user: userId })
			.select("user")
			.lean();
		if (!landlordExists)
			return res
				.status(403)
				.json({ error: "Only landlords can perform this operation" });

		const roomExists = await Room.findById(id).select("building").lean();
		if (!roomExists) return res.status(404).json({ error: "Room not found" });

		const buildingId = roomExists.building;
		const buildingExists = await Building.findById(buildingId)
			.select("landlord")
			.lean();
		if (!buildingExists)
			return res.status(404).json({ error: "Building not found" });

		const user = landlordExists.user;
		if (userId !== user.toString()) {
			return res
				.status(403)
				.json({ error: "Only owners can perform this operation" });
		}

		// or;
		// if (!buildingExists.landlord.equals(landlordExists._id)) {
		// 	return res
		// 		.status(403)
		// 		.json({ error: "Only owners can delete this room" });
		// }

		// now delete the room;
		const room = await Room.findByIdAndDelete(id);
		return res.status(200).json({ message: "Room deleted successfully", room });
	} catch (error) {
		console.error("Error in deleteRoom :", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function updateRoom(req, res) {
	const { roomName, roomType, status, bed, bath, price, buildingName } =
		req.body;
	const userId = req.user.userId;
	const roomId = req.params.id;
	// input Validation;
	if (!mongoose.Types.ObjectId.isValid(roomId)) {
		return res.status(400).json({ error: "Invalid tenant ID" });
	}
	if (!buildingName?.trim()) {
		return res.status(400).json({ error: "Building name is required" });
	}
	if (!roomName?.trim()) {
		return res.status(400).json({ error: "Room name is required" });
	}

	const session = await mongoose.startSession();
	let committed = false;
	session.startTransaction();
	try {
		// check if logged in user is landlord;
		const landlord = await Landlord.findOne({ user: userId })
			.select("_id")
			.lean();
		if (!landlord) {
			session.abortTransaction();
			session.endSession();
			return res
				.status(403)
				.json({ error: "Only property owners can perform this operation" });
		}

		// find the rooms that belong to the landlord;
		const room = await Room.findOne({ roomName, _id: roomId }).populate({
			path: "building",
			select: "buildingName landlord tenants",
		});
		if (!room) {
			session.abortTransaction();
			session.endSession();
			return res.status(404).json({ error: "Room not found" });
		}
		// console.log(landlord._id, room.building.landlord);
		if (String(landlord._id) !== String(room.building.landlord)) {
			session.abortTransaction();
			session.endSession();
			return res.status(403).json({ error: "This is not your property" });
		}

		// Update the building name if changed
		if (room.building.buildingName !== buildingName) {
			await Building.findByIdAndUpdate(
				room.building._id,
				{ buildingName },
				{ session }
			);
		}

		//update the room;
		const updateFields = {
			roomName,
			roomType,
			status,
			bed,
			bath,
			price,
		};

		const updatedRoom = await Room.findByIdAndUpdate(roomId, updateFields, {
			new: true,
			session,
		})
			.populate("tenants", "-_id fullName")
			.populate("building", "buildingName")
			.lean();

		// Commit transaction
		await session.commitTransaction();
		committed = true;
		session.endSession();

		// flatten response;
		const { tenants, building, ...rest } = updatedRoom;
		const firstTenant = tenants?.[0] || {};
		return res.status(200).json({
			message: "Room updated successfully",
			room: {
				...rest,
				building: building._id,
				buildingName: building.buildingName,
				tenantName: firstTenant.fullName || null,
			},
		});
	} catch (error) {
		if (!committed) {
			await session.abortTransaction();
		}
		session.endSession();
		console.error("Error in updateRoom:", error.message);
		return res
			.status(500)
			.json({ error: error.message || "Internal server error" });
	}
}