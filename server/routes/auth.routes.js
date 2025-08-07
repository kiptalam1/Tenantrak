import express from "express";
import { registerUser } from "../controllers/auth.controllers.js";
import { registerValidator } from "../validators/auth.validators.js";
import { handleValidationErrors } from "../middlewares/validationErrorsHandler.js";

const router = express.Router();

router.post("/signup", registerValidator, handleValidationErrors, registerUser);

export default router;
