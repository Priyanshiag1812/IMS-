import express from "express";
import { registerStoreman} from "../controllers/storemanController.js";

const router = express.Router();
router.post("/register-storeman", registerStoreman);

export default router;