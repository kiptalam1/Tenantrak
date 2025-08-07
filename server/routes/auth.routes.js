import express from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
} from "../controllers/auth.controllers.js";
import {
	registerValidator,
	loginValidator,
} from "../validators/auth.validators.js";
import { handleValidationErrors } from "../middlewares/validationErrorsHandler.js";

const router = express.Router();

router.post("/signup", registerValidator, handleValidationErrors, registerUser);
router.post("/login", loginValidator, handleValidationErrors, loginUser);
router.post("/logout", logoutUser);


export default router;
