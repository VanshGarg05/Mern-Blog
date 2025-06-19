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

const likeComment = asyncHandler(async(req,res)=>{
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
        throw new ApiError(404,"Comment not found")
    }

    const userIndex = comment.likes.indexOf(req.user.id)
    if(userIndex===-1){
        comment.numberOfLikes +=1 
        comment.likes.push(req.user.id)
    }else{
        comment.numberOfLikes -=1 
        comment.likes.splice(userIndex,1)
    }

    await comment.save()
    res
    .status(200)
    .json(comment)
})


const editComment = asyncHandler(async(req,res)=>{

    const comment  = await Comment.findById(req.params.commentId)

    if(!comment){
        throw new ApiError(404,"Comment not found")
    }
    if(comment.userId !== req.user.id && req.user.isAdmin === false){
        throw new ApiError(403,"You are not allowed to edit this comment")
    }
    const editedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
          content: req.body.content,
        },
        { new: true }
      )

      return res
      .status(200)
      .json(new ApiResponse(200,editedComment,"Comment edited Successfully"))


})

export 
{
    createComment,
    getPostComments,
    likeComment,
    editComment
}