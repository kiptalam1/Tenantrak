import mongoose from "mongoose";


const RoomSchema = new mongoose.Schema(
	{
		roomName: { type: String, required: true, trim: true },
		roomType: {
			type: String,
			enum: ["single", "1-bedroom", "2-bedroom", "bed-seater"],
			default: "single",
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
		bed: { type: Number, required: true },
		bath: { type: Number, required: true },
		price: { type: Number, required: true },
	},
	{ timestamps: true }
);

// Optional: Prevent duplicate room names within the same building
RoomSchema.index(
	{ building: 1, roomName: 1 },
	{ unique: true, collation: { locale: "en", strength: 2 } }
);

const Room = mongoose.model("Room", RoomSchema);
export default Room;
