import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localpath) => {
    try {
        const response = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto",
        });
        //file has been uploaded sucessfully
        console.log("\nfile has been uploaded on cloudinary");
        // console.log("\nResponse variable :::: \n" + JSON.stringify(response));
        // console.log(
        //     "\nResponse.url variable  :::::  " +
        //         response.url
        // );
        //remove files from localpath public\temp
        //comment below line to see if the files are uploaded locally
        fs.unlinkSync(localpath);
        return response;
    } catch (error) {
        console.log(`\nRemoving file from local path as it is not able to upload on Cloudinary
              :::: user.controller.js :::: uploadOnCloudinary`);
        // remov the locally saved temporary file as upload operation got failed,
        // comment below line to see if the files are uploaded in public\temp
        fs.unlinkSync(localpath);
        return null;
    }
};

export { uploadOnCloudinary };
