import express from "express";
import { createBuilding } from "../controllers/building.controllers.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create-building", verifyToken, createBuilding);

export default router;
