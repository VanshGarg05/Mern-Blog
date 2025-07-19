import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { createPost, getPosts,deletepost, updatePost, uploadPostImage,} from "../controllers/post.controller.js"
import { upload } from "../middleware/multer.js"

const router = express.Router()

// In your routes file
router.post('/create', verifyToken, createPost);
router.route('/getposts').get(getPosts)
router.route('/deletepost/:postId/:userId').delete(verifyToken,deletepost)
router.route('/updatepost/:postId/:userId').put(verifyToken,updatePost)



router.route("/uploadImage").post(
    upload.single('image'),
    uploadPostImage)



export default router