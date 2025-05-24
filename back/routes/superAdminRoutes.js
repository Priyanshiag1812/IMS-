import express from "express";
import {registerSuperAdmin} from "../controllers/superAdminController.js";

const router = express.Router();
router.post("/register-superAdmin", registerSuperAdmin);

export default router;