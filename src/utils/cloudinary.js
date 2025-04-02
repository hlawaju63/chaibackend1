import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from "fs"


  // Configuration
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localpath) =>{
    try {
        const response =  await cloudinary.uploader.upload(localpath ,{
            resource_type : 'auto'
        }
 
    );
     //file has been uploaded sucessfully
    console.log("file has been uploaded on cloudinary"+ response.url)
    return response;

    } catch (error) {
        fs.unlinkSync(localpath)
        // remov the locally saved temporary file as upload operation got failed,
        return null;
    }


}

 export {uploadOnCloudinary}