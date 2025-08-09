import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
	number: { type: String, required: true }, // e.g., "101", "A1"
	roomType: {
		type: String,
		enum: ["single", "1-bedroom"],
		default: "1-bedroom",
	},
	building: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Building",
		required: true,
	},
	tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tenant" }],
	status: {
		type: String,
		enum: ["vacant", "occupied", "maintenance"],
		default: "vacant",
	},
	bed: {
		type: Number,
	},
	bath: {
		type: Number,
	},
	price: {
		type: Number,
		required: true,
	},
});

const Room = mongoose.model("User", RoomSchema);
export default Room;
