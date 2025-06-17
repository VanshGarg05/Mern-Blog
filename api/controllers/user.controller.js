import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcryptjs from "bcryptjs"

const updateUser = asyncHandler(async(req,res)=>{
    if(req.user.id!== req.params.userId){
        throw new ApiError(403,"You are not allowed to update this user")
    }

    if(req.body.password){
        if(req.body.password<6){
            throw new ApiError(400,"Password must be atleast 6 characters")
        }
        req.body.password = bcryptjs.hashSync(req.body.password,10)
    }


    if(req.body.username){
        if(req.body.username<7 || req.body.username>20){
            throw new ApiError(400 ,"Username must be between 7 to 20 characters")
        }
        if(req.body.username.includes(" ")){
            throw new ApiError(400,"Username cannot contain spaces")
        }

        if(req.body.username!==req.body.username.toLowerCase()){
            throw new ApiError(400,"Username must be in Lowercase")
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            throw new ApiError(400,"Username should only contain letters and numbers")
        }
    }
        const updatedUser = await User.findByIdAndUpdate(req.params.userId,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password
            }
        },{new:true})

        const {password,...rest}  = updatedUser._doc
        return res
        .status(200)
        .json(new ApiResponse(200,rest,"User Updated successfully"))
    


})

const deleteUser = asyncHandler(async(req,res)=>{
    if(req.user.id!= req.params.userId){
        throw new ApiError(403,"You are not allowed to delete this user")
    }
    await User.findByIdAndDelete(req.params.userId)
    return res
    .status(200)
    .json(new ApiResponse(200,{},"User has been deleted"))
})

const signout = asyncHandler(async(req,res)=>{
    return res
    .clearCookie('access_token')
    .status(200)
    .json('User has been signout')
})



export {
    updateUser,
    deleteUser,
    signout
}