import mongoose, { Schema } from "mongoose";

const teacherSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  shift: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required:true
  },
  district: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
  },
  number: {
    type: String,
  },
  email: {
    type: String,
  },
  pastInstitute: {
    type: String,
  },
  gender:{
    type:String
  }
});

export const Teacher = mongoose.model("Teacher", teacherSchema);
