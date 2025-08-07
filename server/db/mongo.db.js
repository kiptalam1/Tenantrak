import mongoose from "mongoose";

export default function connectToMongoDb() {
	mongoose
		.connect(process.env.MONGO_URI)
		.then(() => console.log("MongoDb connected successfully."))
		.catch((error) => {
			console.log("Failed to connect to MongoDB :", error);
			process.exit(1);
		});
}
