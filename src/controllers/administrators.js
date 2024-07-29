import { Teacher } from "../models/administration.model.js";
import apiErrorResponse from "../utils/apiErrorResponse.js";
import apiSuccessResponse from "../utils/apiSuccessResponse.js";
import asyncHandler from "../utils/asyncHanlder.js";
import fileUploadonCloudinary from "../utils/cloudinary.js";

const administratorDetailsPost = asyncHandler(async (req, res) => {
  // try {
    const {
      name,
      position, 
      shift,
      address,
      department,
      education,
      joiningDate,
      number,
      email,
      pastInstitute,
      gender,
    } = req.body;
    if (
      [
        name,
        position,
        shift,
        address,
        department,
        education,
        joiningDate,
        number,
        email,
        gender,
      ].some((elem) => elem?.trim() === "")
    ) {
      throw new apiErrorResponse(`all fields are required`);
    }
    const isAlreadyExist = await Teacher.findOne({
      $or: [{ email }, { number }],
    });

    if (isAlreadyExist) {
      throw new apiErrorResponse(
        401,
        "This teacher already axist in our database",
      );
    }
    const fileLocalPath = req.file?.path;
    let fileUpload;

    if (!fileLocalPath) {
      fileUpload = await fileUploadonCloudinary(fileLocalPath);
    }

    const createTeacher = await Teacher.create({
      name,
      position,
      shift,
      address,
      image: fileUpload?.url || '',
      department,
      education,
      joiningDate,
      number,
      email,
      gender,
      pastInstitute: pastInstitute || "",
    });

    const newteacher = await Teacher.findById(createTeacher._id);

    if (!newteacher) {
      throw new apiErrorResponse(
        404,
        "got some error while creating teacher collection",
      );
    }

    return res
      .status(200)
      .json(new apiSuccessResponse(200, newteacher, "Created successfully"));
  // } catch (error) {
  //   throw new apiErrorResponse(401, error.message);
  // }
});

const getAdministrators = asyncHandler(async (req, res) => {
  try {
    const administrators = await Teacher.find();
    if (!administrators) {
      throw new apiErrorResponse(
        500,
        "something went wrong while fetching all administrators details",
      );
    }
    return res
      .status(200)
      .json(
        new apiSuccessResponse(
          200,
          administrators,
          "Successfully got all administrators",
        ),
      );
  } catch (error) {
    throw new apiErrorResponse(500, error.message);
  }
});

const getAdministrator = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new apiErrorResponse(500, "cannot find teacher id");
  }

  const teacher = await Teacher.findById(id);
  if (!id) {
    throw new apiErrorResponse(500, "cannot find teacher with this id");
  }

  return res
    .status(200)
    .json(
      new apiSuccessResponse(
        200,
        teacher,
        "teacher details fetched successfully",
      ),
    );
});

export { administratorDetailsPost, getAdministrators, getAdministrator };
