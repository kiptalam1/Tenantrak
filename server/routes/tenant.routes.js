import express from "express";
import {
	createTenant,
	getAllTenants,
	updateTenant,
} from "../controllers/tenant.controllers.js";
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
router.get("/all", verifyToken, getAllTenants);
router.patch(
	"/update-tenant/:id",
	verifyToken,
	tenantValidators,
	handleValidationErrors,
	updateTenant
);
export default router;
