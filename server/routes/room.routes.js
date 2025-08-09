import express from "express";
import { createRoom } from "../controllers/room.controllers.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create-room", verifyToken, createRoom);

export default router;
