import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.models.js";


const create = asyncHandler(async(req,res)=>{
 
    
    if(!req.user.isAdmin){
        throw new ApiError(403,"You are not allowed to create a post")
    }

    if(!req.body.title || !req.body.content){
        throw new ApiError(400,"Please provide all required fields")
    }
    
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'')
    const newPost = new Post( {
        ...req.body,
        slug, 
        userId: req.user.id
    })

    const savedPost = await newPost.save()

    return res
    .status(201)
    .json(new ApiResponse(200,savedPost,"Post Saved"))
})

const getPosts = asyncHandler(async(req,res)=>{
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.order === 'asc' ? 1 : -1

    const posts = await Post.find({
        ...(req.query.userId && {userId : req.query.userId}),
        ...(req.query.category && {category : req.query.category}),
        ...(req.query.slug && {slug : req.query.slug}),
        ...(req.query.postId && {_id : req.query.postId}),
        ...(req.query.searhTerm && {
            $or:[
                {title:{$regex:req.query.searhTerm,$options:'i'}},
                {content:{ $regex: req.query.searhTerm,$options:'i'}}
            ],
        }),
}).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit)

const totalPosts = await Post.countDocuments();

const now = new Date()

const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth()-1,
    now.getDate()
)

const lastMonthPosts = await Post.countDocuments({
    createdAt:{$gte: oneMonthAgo},
})

return res
.status(200)
.json(new ApiResponse(200,{posts,totalPosts,lastMonthPosts},"Data sent successfully"))


})

const deletepost = asyncHandler(async(req,res)=>{
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        throw new ApiError(403,"You are not allowed to delete this post")
    }
    const deletedPost = await Post.findByIdAndDelete(req.params.postId)
    return res
    .status(200)
    .json(new ApiResponse(200,{deletedPost},"Post has been deleteed successfully"))
})

const updatePost = asyncHandler(async(req,res)=>{
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        throw new ApiError(403,"You are not allowed to update this post")
    }
    
    const updatePost = await Post.findByIdAndUpdate(req.params.postId,
        {
            $set:{
                title:req.body.title,
                content:req.body.content,
                category:req.body.category,
                image:req.body.image,
            }
        },{new:true})


        return res
        .status(200)
        .json(new ApiResponse(200,updatePost,"Post updated successfully"))
})

export {
    create,
    getPosts,
    deletepost,
    updatePost
    
}