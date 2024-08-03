import { Notice } from "../models/notice.model.js";
import apiErrorResponse from "../utils/apiErrorResponse.js";
import apiSuccessResponse from "../utils/apiSuccessResponse.js";
import asyncHandler from "../utils/asyncHanlder.js";
import fileUploadonCloudinary from "../utils/cloudinary.js";

const noticeDetails = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!(title && description)) {
      throw new apiErrorResponse(404, "title and desc required");
    }

    const image = req.file?.path;


    const imageUpload = await fileUploadonCloudinary(image);

    const createNotice = await Notice.create({
      title,
      description: description || "",
      image: imageUpload.url,
    });

    const newNotice = await Notice.findById(createNotice._id);
    if (!newNotice) {
      throw new apiErrorResponse(500, "could not create ");
    }

    return res
      .status(200)
      .json(
        new apiSuccessResponse(200, newNotice, "new post created successfully"),
      );
  } catch (error) {
    throw new apiErrorResponse(500, error);
  }
});

const getNotices = asyncHandler(async(req,res)=>{
	try {
		const notices = await Notice.find();
		if (!notices) {
		  throw new apiErrorResponse(
			500,
			"something went wrong while fetching all notices",
		  );
		}
		return res
		  .status(200)
		  .json(
			new apiSuccessResponse(200, notices, "Successfully got all administrators"),
		  );
	  } catch (error) {
		throw new apiErrorResponse(500, error.message);
	  }
})

const getNotice = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new apiErrorResponse(500, "cannot find id");
    }

    const notice = await Notice.findById(id);
    if (!notice) {
      throw new apiErrorResponse(500, "cannot find notice with this id");
    }
    return res
      .status(200)
      .json(new apiSuccessResponse(200, notice, "notice fetched successfully"));

  } catch (error) {
    throw new apiErrorResponse(500, "cannot fetch notice");
  }
});


export { noticeDetails,getNotices,getNotice };
