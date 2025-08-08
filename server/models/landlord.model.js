import mongoose from "mongoose";

const LandlordSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	phone: { type: String, default: "" },
	buildings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Building" }],
	user: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
	],
});

const Landlord = mongoose.model("Landlord", LandlordSchema);
export default Landlord;
