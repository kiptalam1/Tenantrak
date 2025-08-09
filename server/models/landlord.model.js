import mongoose from "mongoose";

const LandlordSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
		unique: true,
	},
	phone: { type: String, default: "" },
	buildings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Building" }],
});

const Landlord = mongoose.model("Landlord", LandlordSchema);
export default Landlord;
