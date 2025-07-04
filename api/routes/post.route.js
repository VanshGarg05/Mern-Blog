import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { create, getPosts,deletepost, updatePost} from "../controllers/post.controller.js"
import { upload } from "../middleware/multer.js"

const router = express.Router()

router.route('/create').post(verifyToken,create)
router.route('/getposts').get(getPosts)
router.route('/deletepost/:postId/:userId').delete(verifyToken,deletepost)
router.route('/updatepost/:postId/:userId').put(verifyToken,updatePost)

export default router