import mongoose, { Schema } from "mongoose";


const studentSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: String,
    required: true,
  },
  registration: {
    type: String,
  },
  semester: {
    type: String,
    required: true,
  },
  shift: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  captain: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    required:true
  },
  gmail: {
    type: String,
  },
  number: {
    type: Number,
  },
  session: {
    type: String,
    required: true,
  },
});

export const Student = mongoose.model("Student", studentSchema);

