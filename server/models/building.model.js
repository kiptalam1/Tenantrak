import mongoose from "mongoose";

const BuildingSchema = new mongoose.Schema({
	buildingName: { type: String, required: true },
	address: String,
	landlord: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Landlord",
		required: true,
	},
	rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
});

const Building = mongoose.model("Building", BuildingSchema);
export default Building;
