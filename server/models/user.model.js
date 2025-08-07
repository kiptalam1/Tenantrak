import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: [true, "Provide your full names."],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required."],
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required."],
			trim: true,
			minlength: [6, "Password must be at least 6 characters long"],
			select: false,
		},
		role: {
			type: String,
			enum: ["owner", "caretaker", "tenant"],
			default: "owner",
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
