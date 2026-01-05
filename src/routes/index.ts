import {Router} from 'express'
import userRoutes from './user.routes'
import  mediaRoutes from './media.rotes'

const router = Router()

router.use('/user' , userRoutes);
router.use('/media' , mediaRoutes);
export default router