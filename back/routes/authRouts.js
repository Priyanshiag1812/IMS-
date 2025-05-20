import express from 'express';
import { checkAuth,loginUser, logOut} from "../controllers/loginUsers.js";

const router = express.Router();
router.post("/login", loginUser);
router.get("/checkToken", checkAuth);
router.post("/logout", logOut);
export default router;