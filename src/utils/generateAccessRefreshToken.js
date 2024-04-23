import { User } from "../models/user.js";
import apiErrorResponse from "./apiErrorResponse.js";

const generateAccessRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const AccessToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    user.refreshToken = RefreshToken;

    const savedUser = await user.save({
      validateBeforeSave: false,
    });
    if (!savedUser) {
      throw new apiErrorResponse(
        500,
        "Something went wrong while save refresh Token",
      );
    }
    return { AccessToken, RefreshToken };
  } catch (error) {
    throw new apiErrorResponse(500, "error:" + error.message);
  }
};

export default generateAccessRefreshToken;
