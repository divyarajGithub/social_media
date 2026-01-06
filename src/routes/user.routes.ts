import { Router } from "express";
import { editProfile, login, signup } from '../controllers/user'
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post('/editProfile' , isAuthenticated ,  editProfile)


export default router;
