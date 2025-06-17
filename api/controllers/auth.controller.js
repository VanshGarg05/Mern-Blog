import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.models.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"


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

    const safeUser = await User.findById(created._id).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200,safeUser,"User created successfully"))
})


const signin =  asyncHandler(async (req,res)=>{

    const {email,password} = req.body;

    if(!email || !password || email==="" || password===""){
        throw new ApiError(400,"All fields are required")
    }

    const validUser = await User.findOne({email})
    if(!validUser){
        throw new ApiError(404,"User Not Found")
    }

    const validPassword = bcryptjs.compareSync(password,validUser.password)
    if(!validPassword){
        throw new ApiError(400,"Invalid Password")
    }

    const token = jwt.sign(
        {
            id:validUser._id,
            isAdmin:validUser.isAdmin
        },
        process.env.JWT_SECRET)

    const loggedInUser = await User.findById(validUser._id).select("-password")

    const options = {
        httpOnly:true,
        secure: true
    }

    return res
    .status(200)
    .cookie("access_token",token,options)
    .json(new ApiResponse(200,loggedInUser,"User Signed In successfully"))


})


const google = asyncHandler(async(req,res)=>{
    const {email,name,googlePhotoUrl} = req.body
    const user = await User.findOne({email})
    if(user){
        const token = jwt.sign(
            {id:user._id, isAdmin:user.isAdmin},process.env.JWT_SECRET
        )
        const {password,...rest} = user._doc
     
        return res
        .status(200)
        .cookie('access_token',token , {httpOnly:true,secure:true})
        .json(new ApiResponse(200,rest,"SAVED"))
    }else{
        const generatedPassword = Math.random().toString(36).slice(-8)
        const hashedPass = bcryptjs.hashSync(generatedPassword,10)
        const newUser = new User({
            username:name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
            email,
            password: hashedPass,
            profilePicture:googlePhotoUrl
        })
        await newUser.save()
        const token = jwt.sign({id:newUser._id, isAdmin:newUser.isAdmin},process.env.JWT_SECRET)
        const {password,...rest} = newUser._doc
        return res
        .status(200)
        .cookie('access_token',token , {httpOnly:true,secure:true})
        .json(new ApiResponse(200,rest,"SAVED"))
    }

})

export {
    signup,
    signin,
    google
}