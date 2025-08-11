import express from "express";
import { createTenant } from "../controllers/tenant.controllers.js";
import verifyToken from "../middlewares/verifyToken.js";
import { tenantValidators } from "../validators/tenant.validators.js";
import { handleValidationErrors } from "../middlewares/validationErrorsHandler.js";

const router = express.Router();

router.post(
	"/create-tenant",
	verifyToken,
	tenantValidators,
	handleValidationErrors,
	createTenant
);

export default router;
