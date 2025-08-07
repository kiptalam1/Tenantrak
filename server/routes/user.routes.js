import express from "express";
import { getMe } from "../controllers/user.controllers.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/me", verifyToken, getMe);

export default router;
