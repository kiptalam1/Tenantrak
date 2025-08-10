import express from "express";
import {
	createBuilding,
	getBuildings,
} from "../controllers/building.controllers.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create-building", verifyToken, createBuilding);
router.get("/", verifyToken, getBuildings);


export default router;
