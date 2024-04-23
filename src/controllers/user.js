import { User } from "../models/user.js";
import apiErrorResponse from "../utils/apiErrorResponse.js";
import asyncHandler from "../utils/asyncHanlder.js";
import bcrypt from "bcryptjs";
import fileUploadonCloudinary from "../utils/cloudinary.js";
import apiSuccessResponse from "../utils/apiSuccessResponse.js";
import generateAccessRefreshToken from "../utils/generateAccessRefreshToken.js";

const options = {
  httpOnly: true,
  secure: true,
};

const registration = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const { password, name, username, email } = req.body;

    if (!(password || name || username || email)) {
      throw new apiErrorResponse(500, "all fields are required!");
    }

    const existUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existUser) {
      throw new apiErrorResponse(500, "this user already exist");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let image;

    if (req.file?.path) {
      image = req.file?.path;
    }

    let profile;
    if (image) {
      profile = await fileUploadonCloudinary(image);
    }

    const userCreating = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
      image: profile?.url ? profile?.url : "",
    });

    const createdUser = await User.findById(userCreating._id);

    return res
      .status(200)
      .json(
        new apiSuccessResponse(200, createdUser, "User created successfully"),
      );
  } catch (error) {
    throw new apiErrorResponse(500, error.message);
  }
});

const login = asyncHandler(async (req, res) => {
  console.log(req.body.email);
  try {
    const { email, username, password } = req.body;
    console.log(req.body);
    if (!password) {
      throw new apiErrorResponse(400, "password fields are required!");
    }
    if (!(username || email)) {
      throw new apiErrorResponse(400, "username/email fields are required!");
    }
    const alreadyUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!alreadyUser) {
      throw new apiErrorResponse(
        500,
        "sorry! we cannot find user with this email",
      );
    }

    const isPasswordOk = alreadyUser.isPasswordCorrect(password);
    if (!isPasswordOk) {
      throw new apiErrorResponse(500, "sorry! your password incorrect");
    }

    const { AccessToken, RefreshToken } = await generateAccessRefreshToken(
      alreadyUser._id,
    );

    const loggedUser = await User.findById(alreadyUser._id).select(
      "-password -refreshToken",
    );

    return res
      .status(200)
      .cookie("AccessToken", AccessToken, options)
      .cookie("RefreshToken", RefreshToken, options)
      .json(
        new apiSuccessResponse(
          200,
          {
            user: loggedUser,
            AccessToken,
            RefreshToken,
          },
          "User log in successfull",
        ),
      );
  } catch (error) {
    throw new apiErrorResponse(500, error.message);
  }
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  return res
    .status(200)
    .json(new apiSuccessResponse(200, {}, "user logout successfully"))
    .cookie("RefreshToken", options)
    .cookie("AccessToken", options);
});

const currentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new apiSuccessResponse(200, req.user, "Current user get successfully"),
    );
});

const changeProfile = asyncHandler(async (req, res) => {
  try {
    const  image  = req.file.path;
    if (!image) {
      throw new apiErrorResponse(404, "profile pic required");
    }

    const uploadProfile = await fileUploadonCloudinary(image);

    if (!uploadProfile.url) {
      throw new apiErrorResponse(
        500,
        "something went while upload file on cloudinary",
      );
    }
    const updateProfile = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { image: uploadProfile?.url } },
      { new: true },
    ).select("-password -refreshToken");
    await updateProfile
      .save({ validateBeforeSave: false })
    return res
      .status(200)
      .json(
        new apiSuccessResponse(
          200,
          updateProfile,
          "change profile successfully",
        ),
      );
  } catch (error) {
    throw new apiErrorResponse(401, error.message);
  }
});
export { registration, login, logout, currentUser, changeProfile };
