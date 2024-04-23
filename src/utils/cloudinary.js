import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config(
	{
		cloud_name:process.env.CLOUD_NAME,
		api_key:process.env.CLOUD_API_KEY,
		api_secret:process.env.CLOUD_API_SECRET,
		secure: true,
	}
)

const fileUploadonCloudinary =async(localfilepath)=>{
	try {
		if (!localfilepath) {
			return null;
		}
		const response = await cloudinary.uploader.upload(localfilepath,{
			resource_type:"image",
		})
		if (response) {
			fs.unlinkSync(localfilepath)
		}
		return response;
	} catch (error) {
		fs.unlinkSync(localfilepath)
		console.log(error);
		return null
	}
}

export default fileUploadonCloudinary