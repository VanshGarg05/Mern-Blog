import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.models.js";
import fs from "fs";
import { uploadOnCLoudinary } from "../utils/cloudinary.js";
import path from 'path'


const create = asyncHandler(async(req,res)=>{
 
    
    if(!req.user.isAdmin){
        throw new ApiError(403,"You are not allowed to create a post")
    }

    if(!req.body.title || !req.body.content){
        throw new ApiError(400,"Please provide all required fields")
    }
    let imageUrl = "";
    if (req.file?.path) {
        const result = await uploadOnCLoudinary(req.file.path);
        imageUrl = result?.secure_url || "";
    
        // delete temp file after upload
        fs.unlinkSync(req.file.path);
      }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'')
    const newPost = new Post( {
        ...req.body,
        slug, 
        image: imageUrl,
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
        ...(req.query.searchTerm && {
            $or:[
                {title:{$regex:req.query.searchTerm,$options:'i'}},
                {content:{ $regex: req.query.searchTerm,$options:'i'}}
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
    
    let imageUrl = req.body.image || "";
    if (req.file?.path) {
        const result = await uploadOnCLoudinary(req.file.path);
        imageUrl = result?.secure_url || "";
    
        // delete temp file after upload
        fs.unlinkSync(req.file.path);
    }
    
    const updatedPost = await Post.findByIdAndUpdate(req.params.postId,
        {
            $set:{
                title:req.body.title,
                content:req.body.content,
                category:req.body.category,
                image: imageUrl,
            }
        },{new:true})
        
    return res
        .status(200)
        .json(new ApiResponse(200,updatedPost,"Post updated successfully"))
})


// api/controller/post.controller.js
// api/controller/post.controller.js
// const uploadPostImage = asyncHandler(async (req, res) => {
//     const postImagePath = req.file?.path;

//     if (!req.file || !postImagePath) {
//         throw new ApiError(400, "No image file uploaded");
//     }

//     const uploadedImage = await uploadOnCLoudinary(postImagePath);

//     if (!uploadedImage) {
//         throw new ApiError(500, "Failed to upload image to Cloudinary");
//     }

//     console.log("Image uploaded to Cloudinary:", uploadedImage.secure_url);

//     return res.status(200).json(
//         new ApiResponse(200, { imageUrl: uploadedImage.secure_url }, "Image uploaded successfully")
//     );
// });

const uploadPostImage = asyncHandler(async (req,res)=>{

const imageLocalPath = path.resolve(req.file?.path);

// const coverImageLocalPath = req.files?.coverImage[0]?.path;
if(!imageLocalPath){
    throw new ApiError(400, "Avatar file is required");
}


    const image = await uploadOnCLoudinary(imageLocalPath)
    
    if(!image){
        throw new ApiError(400, "Image file is required");
    }
    const data = image.url;
    return res.status(201).json(
        new ApiResponse(200,data,"User registered successfully")
    )
})

// Function for creating post with image
const createPost = asyncHandler(async (req, res) => {
    try {
        

        const { title, content, category, imageUrl: frontendImageUrl } = req.body;
        const postImagePath = req.file?.path;

        // Ensure only admins can create posts
        if (!req.user || !req.user.isAdmin) {
            throw new ApiError(403, "Only admins can create posts");
        }

        // Validate required fields
        if (!title || !content) {
            throw new ApiError(400, "Title and content are required");
        }

        let imageUrl = frontendImageUrl || null;

        // If file is uploaded via form-data, upload to Cloudinary
        if (postImagePath) {
            const postImage = await uploadOnCLoudinary(postImagePath);
            if (!postImage || !postImage.secure_url) {
                throw new ApiError(400, "Failed to upload image to Cloudinary");
            }
            imageUrl = postImage.secure_url;
        }

        // Create slug from title
        const slug = `${title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')}-${Date.now()}`;

        // Create the post
        const newPost = await Post.create({
            title,
            content,
            category: category || 'uncategorized',
            image: imageUrl,
            slug,
            userId: req.user.id
        });

        return res.status(201).json(
            new ApiResponse(201, newPost, "Post created successfully")
        );
    } catch (error) {
        console.error('CreatePost error:', error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error while creating post");
    }
});



export {
    create,
    getPosts,
    deletepost,
    updatePost,
    uploadPostImage,
    createPost
}