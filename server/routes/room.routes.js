import express from "express";
import {
	createRoom,
	getAllRooms,
	deleteRoom,
	updateRoom,
} from "../controllers/room.controllers.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create-room", verifyToken, createRoom);
router.get("/all", verifyToken, getAllRooms);
router.delete("/room/:id", verifyToken, deleteRoom);
router.patch("/update-room/:id", verifyToken, updateRoom);



export default router;
