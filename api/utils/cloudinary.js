import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCLoudinary = async (localFilePath) => {
    try {
        
        if(!localFilePath) return null;
        // console.log("Uploading to Cloudinary:", localFilePath);

        const response =  await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        // console.log("File is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}


export {uploadOnCLoudinary}
