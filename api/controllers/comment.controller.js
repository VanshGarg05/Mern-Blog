import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js"


const createComment = asyncHandler(async(req,res)=>{

    const { content, postId, userId } = req.body
    if(userId!== req.user.id){
        throw new ApiError(403,"You are not allowed to create this comment")
    }

    const newComment = new Comment({
        content,
        postId,
        userId
    })

    await newComment.save()

    return res
    .status(200)
    .json(new ApiResponse(200,newComment,"Comment saved Successfully"))
})


const getPostComments = asyncHandler(async(req,res)=>{

    const comments = await Comment.find({postId:req.params.postId}).sort({
        createdAt:-1
    })

    return res
    .status(200)
    .json(new ApiResponse(200,comments,"Comments sent Successfully"))

})


export 
{
    createComment,
    getPostComments
}