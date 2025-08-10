import express from "express";
import {
	createRoom,
	getAllRooms,
	deleteRoom,
} from "../controllers/room.controllers.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create-room", verifyToken, createRoom);
router.get("/all", verifyToken, getAllRooms);
router.delete("/room/:id", verifyToken, deleteRoom);



export default router;
