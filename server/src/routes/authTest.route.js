import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { getGoogleAuth, getTestAdmin, getTestArtisan, getTestCustomer } from "../controllers/authTest.controller.js";

const router = express.Router();

router.get("/test-auth", requireAuth, getGoogleAuth);
router.get("/test-customer", requireAuth, requireRole("customer"), getTestCustomer);
router.get("/test-artisan", requireAuth, requireRole("artisan"), getTestArtisan);
router.get("/test-admin", requireAuth, requireRole("administrator"), getTestAdmin);

export default router;