import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = Schema({
  username: {
    type: String,
    toLowerCase: true,
    trim: true,
    unique: true,
    required: [true, "username is required"],
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
      "Please Enter a valid strong address",
    ],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  image: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
  },
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
      algorithm: "HS512",
    },
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },

    process.env.REFRESH_TOKEN_SECRET,
    {
      algorithm: "HS512",
    },
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};
export const User = mongoose.model("User", userSchema);
