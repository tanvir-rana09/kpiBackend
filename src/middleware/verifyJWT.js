import { User } from "../models/user.js";
import apiErrorResponse from "../utils/apiErrorResponse.js";
import asyncHandler from "../utils/asyncHanlder.js";
import jwt from "jsonwebtoken";

const verifyUserWithJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.RefreshToken;
    if (!token) {
      throw new apiErrorResponse(404, "unauthorize request");
    }

    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (!decodedToken) {
      throw new apiErrorResponse(404, "token not valid");
    }

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );
    if (!user) {
      throw new apiErrorResponse(401, "token not valid");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new apiErrorResponse(404, error.message);
  }
});

export default verifyUserWithJWT;
