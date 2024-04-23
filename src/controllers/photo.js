import { Photo } from "../models/photo.model.js";
import apiErrorResponse from "../utils/apiErrorResponse.js";
import apiSuccessResponse from "../utils/apiSuccessResponse.js";
import asyncHandler from "../utils/asyncHanlder.js";
import fileUploadonCloudinary from "../utils/cloudinary.js";

const photoDetails = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      throw new apiErrorResponse(404, "title required");
    }

    const image = req.file?.path;
    
    if (!image) {
      throw new apiErrorResponse(404, "photo must required");
    }

    const imageUpload = await fileUploadonCloudinary(image);

    const createPost = await Photo.create({
      title,
      image: imageUpload.url,
    });

    const newPost = await Photo.findById(createPost._id);
    if (!newPost) {
      throw new apiErrorResponse(500, "could not create ");
    }

    return res
      .status(200)
      .json(
        new apiSuccessResponse(200, newPost, "new post created successfully"),
      );
  } catch (error) {
    throw new apiErrorResponse(500, "cannot post photo");
  }
});

const getImages = asyncHandler(async(req,res)=>{
	try {
		const image = await Photo.find();
		if (!image) {
		  throw new apiErrorResponse(
			500,
			"something went wrong while fetching all images",
		  );
		}
		return res
		  .status(200)
		  .json(
			new apiSuccessResponse(200, image, "Successfully got all teachers"),
		  );
	  } catch (error) {
		throw new apiErrorResponse(500, error.message);
	  }
})

const image = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new apiErrorResponse(500, "cannot find id");
    }

    const img = await Photo.findById(id);
    if (!img) {
      throw new apiErrorResponse(500, "cannot find image with this id");
    }
    return res
      .status(200)
      .json(new apiSuccessResponse(200, img, "image fetched successfully"));

  } catch (error) {
    throw new apiErrorResponse(500, "cannot fetch image");
  }
});


export { photoDetails, image,getImages };
