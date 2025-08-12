import mongoose from "mongoose";
import Tenant from "../models/tenant.model.js";
import Landlord from "../models/landlord.model.js";
import Room from "../models/room.model.js";
import Building from "../models/building.model.js";
import User from "../models/user.model.js";


export async function getAllTenants(req, res) {
	const userId = req.user.userId;
	try {
		// get landlord buildings
		const landlord = await Landlord.findOne({ user: userId })
			.select("buildings")
			.lean();

		if (!landlord?.buildings?.length) {
			return res.status(200).json({ tenants: [] });
		}

		// fetch tenants, populate room -> building, selecting only needed fields
		const tenants = await Tenant.find()
			.select(
				"fullName email phone status room leaseStart leaseEnd createdAt updatedAt"
			)
			.populate({
				path: "room",
				match: { building: { $in: landlord.buildings } }, // limit to this landlord
				select: "roomName building price",
				populate: { path: "building", select: "buildingName" },
			})
			.lean();

		// filter out tenants whose room doesn't belong to this landlord and flatten
		const flattened = tenants
			.filter((t) => t.room) // remove tenants not in landlord's rooms
			.map((t) => ({
				_id: t._id,
				fullName: t.fullName,
				email: t.email ?? null,
				phone: t.phone ?? null,
				status: t.status ?? null,
				room: t.room?._id ?? null,
				roomName: t.room?.roomName ?? null,
				buildingName: t.room?.building?.buildingName ?? null,
				price: t.room?.price ?? null,
				leaseStart: t.leaseStart ?? null,
				leaseEnd: t.leaseEnd ?? null,
				createdAt: t.createdAt ?? null,
				updatedAt: t.updatedAt ?? null,
			}));

		return res.status(200).json({ tenants: flattened });
	} catch (error) {
		console.error("Error in getAllTenants:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

export async function createTenant(req, res) {
	const session = await mongoose.startSession();
	session.startTransaction();

	const userId = req.user.userId;
	const { fullName, email, phone, roomName, status, leaseStart, leaseEnd } =
		req.body;

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
			status: status || "active",
			room: room._id,
			leaseEnd,
			leaseStart,
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

		// fetch populated tenant
		const populatedTenant = await Tenant.findById(newTenant._id)
			.populate({
				path: "room",
				select: "roomName building",
				populate: { path: "building", select: "buildingName" },
			})
			.lean();

		// flatten structure
		const flatTenant = {
			...populatedTenant,
			roomName: populatedTenant.room?.roomName || null,
			buildingName: populatedTenant.room?.building?.buildingName || null,
		};

		res.status(201).json({
			message: "Tenant added successfully",
			tenant: flatTenant,
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error("Error in createTenant :", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

// update a tenant's info;
export async function updateTenant(req, res) {
	const userId = req.user.userId;
	const { fullName, email, phone, roomName, status, leaseStart, leaseEnd } =
		req.body;
	const tenantId = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(tenantId)) {
		return res.status(400).json({ error: "Invalid tenant ID" });
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// 1. Check landlord
		const landlord = await Landlord.findOne({ user: userId })
			.select("_id")
			.lean();
		if (!landlord) {
			await session.abortTransaction();
			session.endSession();
			return res
				.status(403)
				.json({ error: "Only property owners can perform this operation" });
		}

		// 2. Get tenant with current room + building
		const tenant = await Tenant.findOne({ _id: tenantId })
			.populate({
				path: "room",
				select: "building",
				populate: { path: "building", select: "landlord" },
			})
			.lean();

		if (!tenant) {
			await session.abortTransaction();
			session.endSession();
			return res.status(404).json({ error: "Tenant not found" });
		}
		if (String(tenant.room.building.landlord) !== String(landlord._id)) {
			await session.abortTransaction();
			session.endSession();
			return res.status(403).json({ error: "This is not your tenant" });
		}

		let newRoom = null;
		if (roomName) {
			// Find new room
			newRoom = await Room.findOne({ roomName })
				.populate("building", "landlord")
				.session(session); // include in transaction

			if (!newRoom) {
				await session.abortTransaction();
				session.endSession();
				return res.status(404).json({ error: "Room not found" });
			}

			// Ownership check
			if (String(newRoom.building.landlord) !== String(landlord._id)) {
				await session.abortTransaction();
				session.endSession();
				return res
					.status(403)
					.json({ error: "This room does not belong to you" });
			}

			// Vacant check
			if (
				String(newRoom._id) !== String(tenant.room._id) &&
				newRoom.status !== "vacant"
			) {
				const roomStatus =
					newRoom.status === "maintenance" ? "under maintenance" : "occupied";
				await session.abortTransaction();
				session.endSession();
				return res.status(403).json({ error: `This room is ${roomStatus}` });
			}
		}

		// 3. Update tenant
		const updateFields = {
			fullName,
			email,
			phone,
			status,
			leaseStart,
			leaseEnd,
		};
		if (newRoom) updateFields.room = newRoom._id;

		const updatedTenant = await Tenant.findOneAndUpdate(
			{ _id: tenantId },
			updateFields,
			{ new: true, session }
		);

		// 4. Update room statuses if changed
		if (newRoom && String(tenant.room._id) !== String(newRoom._id)) {
			await Room.findByIdAndUpdate(
				tenant.room._id,
				{ status: "vacant" },
				{ session }
			);
			await Room.findByIdAndUpdate(
				newRoom._id,
				{ status: "occupied" },
				{ session }
			);
		}

		// Commit transaction
		await session.commitTransaction();
		session.endSession();

		return res.json({
			message: "Tenant was updated successfully",
			tenant: updatedTenant,
		});
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		console.error("Error in updateTenant:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
