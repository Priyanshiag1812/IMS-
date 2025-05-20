import express from "express";
import { registerFaculty} from "../controllers/facultyController.js";

const router = express.Router();
router.post("/register-faculty", registerFaculty);

export default router;