import { Teacher } from "../models/administration.model.js";
import apiErrorResponse from "../utils/apiErrorResponse.js";
import apiSuccessResponse from "../utils/apiSuccessResponse.js";
import asyncHandler from "../utils/asyncHanlder.js";
import fileUploadonCloudinary from "../utils/cloudinary.js";

const teacherDetailsPost = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      position,
      shift,
      district,
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
        district,
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
    console.log(req.file?.path);
    if (!fileLocalPath) {
      throw new apiErrorResponse(404, "image not found");
    }
    const fileUpload = await fileUploadonCloudinary(fileLocalPath);

    const createTeacher = await Teacher.create({
      name,
      position,
      shift,
      district,
      image: fileUpload.url,
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
  } catch (error) {
    throw new apiErrorResponse(401, error.message);
  }
});

const getTeachers = asyncHandler(async (req, res) => {
  try {
    const teachers = await Teacher.find();
    if (!teachers) {
      throw new apiErrorResponse(
        500,
        "something went wrong while fetching all teachers details",
      );
    }
    return res
      .status(200)
      .json(
        new apiSuccessResponse(200, teachers, "Successfully got all teachers"),
      );
  } catch (error) {
    throw new apiErrorResponse(500, error.message);
  }
});

const getTeacher = asyncHandler(async (req, res) => {
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

export { teacherDetailsPost, getTeachers,getTeacher };
