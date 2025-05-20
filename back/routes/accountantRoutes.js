import express from "express";
import { registerAccountant} from "../controllers/accountantController.js";

const router = express.Router();
router.post("/register-accountant", registerAccountant);

export default router;