import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

//functions;
import connectToMongoDb from "./db/mongo.db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import buildingRoutes from "./routes/building.routes.js";
import roomRoutes from "./routes/room.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";

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
app.use("/api/rooms", roomRoutes);
app.use("/api/tenants", tenantRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
	// serve static files from the frontend build directory
	app.use(express.static(path.join(__dirname, "/client/dist")));

	// handle any requests that don't match the above routes
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
	});
}


const PORT = process.env.PORT || 5000;

connectToMongoDb();

app.listen(PORT, () => {
	console.log(`server is running at http://localhost:${PORT}`);
	console.log("Connecting to mongoDB...");
});
