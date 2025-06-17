import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { create, getPosts} from "../controllers/post.controller.js"
import { upload } from "../middleware/multer.js"

const router = express.Router()

router.route('/create').post(verifyToken,create)
router.route('/getposts').get(getPosts)

export default router