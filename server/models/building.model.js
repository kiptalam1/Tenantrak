import mongoose from "mongoose";

const BuildingSchema = new mongoose.Schema({
	buildingName: { type: String, required: true }, // <-- removed unique: true
	address: String,
	landlord: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Landlord",
		required: true,
	},
	rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
});

// Compound unique index per landlord, case-insensitive
BuildingSchema.index(
	{ buildingName: 1, landlord: 1 },
	{ unique: true, collation: { locale: "en", strength: 2 } }
);


const Building = mongoose.model("Building", BuildingSchema);
export default Building;
