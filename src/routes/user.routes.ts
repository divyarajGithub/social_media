import { Router } from "express";
import { editProfile, followUnfollow, getSuggestedUser, login, signup } from '../controllers/user'
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post('/editProfile' , isAuthenticated ,  editProfile)
router.post('/followUnfollow' , isAuthenticated , followUnfollow)
router.get('/getSuggestedUsers' , isAuthenticated , getSuggestedUser)



export default router;
