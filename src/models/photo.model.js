import mongoose, { Schema } from "mongoose";

const photoSchema = Schema(
  {
    title: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timeStamps: true },
);

export const Photo = mongoose.model("Photo", photoSchema);
