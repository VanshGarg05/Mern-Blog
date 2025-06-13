import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.models.js"
import bcryptjs from "bcryptjs"


const signup = asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body
    if(!username || !email || !password || username==="" || password==="" || email===""){
        throw new ApiError(400,"All fields are required")
    }

    const hashPass = bcryptjs.hashSync(password,10)

    const  newUser = new User({
        username,
        email,
        password:hashPass
    })

    const created = await newUser.save()
    return res
    .status(200)
    .json(new ApiResponse(200,created,"User created successfully"))
})

export {
    signup    
}