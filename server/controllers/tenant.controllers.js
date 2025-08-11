import mongoose from "mongoose";
import Tenant from "../models/tenant.model.js";
import Landlord from "../models/landlord.model.js";
import Room from "../models/room.model.js";
import Building from "../models/building.model.js";
import User from "../models/user.model.js";

export async function createTenant(req, res) {
	const session = await mongoose.startSession();
	session.startTransaction();

	const userId = req.user.userId;
	const { fullName, email, phone, roomName } = req.body;

	try {
		// check if logged in user is a landlord;
		const user = await User.findOne({ _id: userId, role: "owner" })
			.session(session)
			.lean();
		if (!user) {
			await session.abortTransaction();
			session.endSession();
			return res.status(403).json({ error: "Only landlords can add tenants" });
		}

		// check whether the room belongs to the landlord;
		const landlord = await Landlord.findOne({ user: userId })
			.select("_id")
			.session(session)
			.lean();

		if (!landlord) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).json({ error: "Landlord profile not found" });
		}

		const room = await Room.findOne({ roomName })
			.select("_id building status tenants")
			.session(session)
			.lean();

		if (!room) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).json({ error: "This room does not exist" });
		}

		const building = await Building.findOne({
			_id: room.building,
			landlord: landlord._id,
		})
			.session(session)
			.lean();

		if (!building) {
			await session.abortTransaction();
			session.endSession();
			return res
				.status(403)
				.json({ error: "This property does not belong to you." });
		}

		// check if tenant is already added;
		const tenant = await Tenant.findOne({ fullName, phone })
			.session(session)
			.lean();
		if (tenant) {
			await session.abortTransaction();
			session.endSession();
			return res
				.status(409)
				.json({ error: "This tenant has already been added" });
		}

		// check whether the room to be occupied already has a tenant;
		if (room.status !== "vacant") {
			await session.abortTransaction();
			session.endSession();
			const roomStatus =
				room.status === "maintenance" ? "under maintenance" : "occupied";
			return res.status(403).json({ error: `This room is ${roomStatus}` });
		}

		// create and save tenant
		const newTenant = new Tenant({
			fullName,
			email: email || null,
			phone,
			room: room._id,
		});
		await newTenant.save({ session });

		// update room
		await Room.updateOne(
			{ _id: room._id },
			{ $push: { tenants: newTenant._id }, $set: { status: "occupied" } },
			{ session }
		);

		await session.commitTransaction();
		session.endSession();

		res.status(201).json({ message: "Tenant added successfully", newTenant });
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error("Error in createTenant :", error);
		res.status(500).json({ error: "Internal server error" });
	}
}
