import { Student } from "../models/student.model.js";
import apiErrorResponse from "../utils/apiErrorResponse.js";
import apiSuccessResponse from "../utils/apiSuccessResponse.js";
import asyncHandler from "../utils/asyncHanlder.js";
import fileUploadonCloudinary from "../utils/cloudinary.js";

const studentDetailsPost = asyncHandler(async (req, res) => {
  // try {
    const {
      name,
      roll,
      registration,
      semester,
      shift,
      group,
      captain,
      gmail,
      number,
      gender,
      session,
    } = req.body;
console.log(req.body);

    if (
      [name, roll, semester, shift, group, session, gender].some(
        (elem) => elem?.trim() === "",
      )
    ) {
      throw new apiErrorResponse(`all fields are required`);
    }

    const alreadyExistStudent = await Student.findOne({
      $or: [{ roll }, { registration }],
    });

    const fileLocalPath = req.file?.path;
    let fileUpload;

    if (fileLocalPath) {
      fileUpload = await fileUploadonCloudinary(fileLocalPath);
    }

    if (alreadyExistStudent) {
      throw new apiErrorResponse(
        401,
        "This student already axist in our database",
      );
    }

    const student = await Student.create({
      name,
      roll,
      registration: registration || "",
      semester,
      shift,
      group,
      captain: captain || false,
      gmail: gmail || "",
      number: number || "",
      gender,
      session,
      image: fileUpload?.url || '',
    });

    const newUser = await Student.findById(student._id);

    if (!newUser) {
      throw new apiErrorResponse(401, "can not create user");
    }

    return res
      .status(200)
      .json(
        new apiSuccessResponse(
          200,
          newUser,
          "student details post successfully",
        ),
      );
  // } catch (error) {
  //   throw new apiErrorResponse(
  //     401,
  //     error.message || "can not post student details",
  //   );
  // }
});

const allStudents = asyncHandler(async (_, res) => {
  try {
    const students = await Student.find();
    console.log(students);
    if (!students) {
      throw new apiErrorResponse(500, "cannot get students");
    }

    return res
      .status(200)
      .json(
        new apiSuccessResponse(
          200,
           students ,
          "successfully fetch all students details",
        ),
      );
  } catch (error) {
    throw new apiErrorResponse(500, "fetch all students error");
  }
});

const getAstudent = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      // Yes, it's a valid ObjectId, proceed with `findById` call.
      if (!id) {
        throw new apiErrorResponse(404, "id not found");
      }
      const student = await Student.findById(id);

      if (!student) {
        throw new apiErrorResponse(404, "something went wrong to find user!");
      }

      return res
        .status(200)
        .json(
          new apiSuccessResponse(
            200,
            { student },
            "User data fetched successfully",
          ),
        );
    }
  } catch (error) {
    throw new apiErrorResponse(500, error.message);
  }
});

const semesterStudents = asyncHandler(async (req, res) => {
  try {
    // const query=req.query;
    const { semester } = req.query;
    // console.log(query);
    if (!semester) {
      throw new apiErrorResponse(404, "unknown semester!");
    }

    const studentBySemester = await Student.find({ semester });
    console.log(studentBySemester);
    if (!studentBySemester) {
      throw new apiErrorResponse(
        404,
        "something went wrong cannot find students by semester",
      );
    }
    return res
      .status(200)
      .json(
        new apiSuccessResponse(
          200,
          studentBySemester,
          "student data sort successfully",
        ),
      );
  } catch (error) {
    throw new apiErrorResponse(401, error.message);
  }
});

export { studentDetailsPost, allStudents, getAstudent, semesterStudents };
