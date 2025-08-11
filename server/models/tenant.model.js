import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true, unique: true },
		email: { type: String, required: false, trim: true, lowercase: true },
		phone: String,
		room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
		leaseStart: { type: Date, default: Date.now },
		leaseEnd: {
			type: Date,
			default: "",
		},
	},
	{ timestamps: true }
);

const Tenant = mongoose.model("Tenant", TenantSchema);
export default Tenant;
