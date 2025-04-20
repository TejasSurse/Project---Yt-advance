// in this 
// 1 get path form server files (uploaded form user)
// 2 upload to cloudinary
// 3 get path from cloudinary
// 4 save path to database
// remove form server

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
// fs is file system -- by default in node js
// helps to read and write files all file operations


 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        // upload to cloudinary
       let response =  await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        }        )
        //console.log("file is uploaded to cloudinary", response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally file temp file as the upload operation got failed
        return null;       
    }
}


export { uploadOnCloudinary }