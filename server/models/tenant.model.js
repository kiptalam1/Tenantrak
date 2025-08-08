import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	email: String,
	phone: String,
	room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
	leaseStart: Date,
	leaseEnd: Date,
	user: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});

const Tenant = mongoose.model("User", TenantSchema);
export default Tenant;
