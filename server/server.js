import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";

//functions;
import connectToMongoDb from "./db/mongo.db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import buildingRoutes from "./routes/building.routes.js";

const app = express();

// middleware;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

// routes;
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/buildings", buildingRoutes);



const PORT = process.env.PORT || 5000;

connectToMongoDb();

app.listen(PORT, () => {
	console.log(`server is running at http://localhost:${PORT}`);
	console.log("Connecting to mongoDB...");
});
