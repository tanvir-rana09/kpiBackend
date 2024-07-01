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
  sameSite: "None",
};

const registration = asyncHandler(async (req, res) => {
  const { password, name, email } = req.body;

  // Check if any required fields are missing
  if (!password || !name || !email) {
    throw new apiErrorResponse(400, "All fields are required!");
  }

  // Check if user already exists
  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new apiErrorResponse(400, "User already exists");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  let profileUrl = "";

  if (req.file && req.file.path) {
    // Upload profile image to cloudinary
    const profile = await fileUploadonCloudinary(req.file.path);
    profileUrl =
      profile.url ||
      "https://res.cloudinary.com/tanvirrana/image/upload/v1716975541/ak4rodbdzqpd10scsqxn.jpg";
  }

  // Create the user
  const createdUser = await User.create({
    email,
    password: hashedPassword,
    name,
    username: "",
    image:
      "https://res.cloudinary.com/tanvirrana/image/upload/v1716975541/ak4rodbdzqpd10scsqxn.jpg",
  });

  // Return success response
  res
    .status(200)
    .json(
      new apiSuccessResponse(200, createdUser, "User created successfully"),
    );
});

// login controller here --------------------------

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!password) {
    throw new apiErrorResponse(400, "password fields are required!");
  }
  if (!email) {
    throw new apiErrorResponse(400, "email fields are required!");
  }
  const alreadyUser = await User.findOne({
    $or: [{ email }],
  });

  if (!alreadyUser) {
    return res
      .status(401)
      .json({ email: "sorry! we cannot find user with this email" });
    // throw new apiErrorResponse(
    //   500,
    //   "sorry! we cannot find user with this email",
    // );
  }

  const isPasswordOk = await alreadyUser.isPasswordCorrect(password);

  if (!isPasswordOk) {
    // return res.json(new apiErrorResponse(401, "sorry! your password incorrect"))
    return res.status(401).json({ password: "Your password is incorrect!" });
  }

  const { AccessToken, RefreshToken } = await generateAccessRefreshToken(
    alreadyUser._id,
  );

  const loggedUser = await User.findById(alreadyUser._id).select(
    "-password -refreshToken",
  );

  const response = res
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
  return response;
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
  res.clearCookie("RefreshToken", options);
  res.clearCookie("AccessToken", options);
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
  const image = req.file?.path;
  console.log(req.file);
  if (!image) {
    throw new apiErrorResponse(404, "image not found");
  }
  const uploadProfile = await fileUploadonCloudinary(image);

  if (!uploadProfile?.url) {
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
  await updateProfile.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(
      new apiSuccessResponse(200, updateProfile, "change profile successfully"),
    );
});

const chnagePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword || newPassword)) {
      throw new apiErrorResponse(404, "all filed are reequired");
    }
    const user = await User.findById(req.user._id);
    const checkPassword = await user.isPasswordCorrect(oldPassword);

    if (!checkPassword) {
      throw new apiErrorResponse(401, "password is incorrect!");
    }

    user.password = newPassword;
    await user.save({
      validateBeforeSave: false,
    });

    return res.json(
      new apiSuccessResponse(200, user, "user password change successfully"),
    );
  } catch (error) {
    throw new apiErrorResponse(401, error.message);
  }
});

const getUserDetails = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new apiErrorResponse(404, "user id not found");
    }

    const user = await User.findById(id)?.select("-password -refreshToken");

    if (!user) {
      throw new apiErrorResponse(404, "user not found with this id!");
    }
    return res.json(
      new apiSuccessResponse(200, user, "User details fetched successfully"),
    );
  } catch (error) {
    throw new apiErrorResponse(500, error.message);
  }
});
export {
  registration,
  login,
  logout,
  currentUser,
  changeProfile,
  chnagePassword,
  getUserDetails,
};
