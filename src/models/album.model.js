import mongoose, { Schema } from "mongoose";

const photoSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  photos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Photo",
    },
  ],
});

export const Photo = mongoose.model("Photo", photoSchema);
