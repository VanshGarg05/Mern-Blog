import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoute from "./routes/user.route.js"
import authRoute from "./routes/auth.route.js"
import postRoute from "./routes/post.route.js"
import commentRoute from "./routes/comment.route.js "
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("MongoDb is connected");
})
.catch((err)=>{
    console.log(err);
})
const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})


app.use('/api/user',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/post',postRoute)
app.use('/api/comment',commentRoute)