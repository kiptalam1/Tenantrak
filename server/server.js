import express from "express";
import dotenv from "dotenv";
import connectToMongoDb from "./db/mongo.db.js";
dotenv.config();

const app = express();

app.get("/", (req, res) => {
	res.send("hello world");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`server is running at http://localhost:${PORT}`);
	console.log("Connecting to mongoDB...");
	connectToMongoDb();
});
