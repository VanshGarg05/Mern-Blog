import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoute from "./routes/user.route.js"
import authRoute from "./routes/auth.route.js"
import postRoute from "./routes/post.route.js"
import commentRoute from "./routes/comment.route.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import path from 'path';


dotenv.config()

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("MongoDb is connected");
})
.catch((err)=>{
    console.log(err);
})

const __dirname = path.resolve();

const app = express()



app.use(cors('*'));

app.use((req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.startsWith("multipart/form-data")) {
      next(); // Skip JSON parser for file uploads
    } else {
      express.json({ limit: "10mb" })(req, res, next);
    }
  });
  
app.use(express.urlencoded({extended: true,limit:'16kb'}))
app.use(cookieParser())

const port = process.env.PORT || 5000 

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})


app.use('/api/user',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/post',postRoute)
app.use('/api/comment',commentRoute)

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/', 'index.html'));
});