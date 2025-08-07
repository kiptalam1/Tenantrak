import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

//functions;
import connectToMongoDb from "./db/mongo.db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// middleware;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes;
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;

connectToMongoDb();

app.listen(PORT, () => {
	console.log(`server is running at http://localhost:${PORT}`);
	console.log("Connecting to mongoDB...");
});
