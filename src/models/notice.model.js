import mongoose, { Schema } from "mongoose";

const noticeSchema = Schema({
  title:{
	type:String
  },
  smallDesc:{
	type:String
  },
  image:{
	type:String
  }
},{timeStamps:true});

export const Notice = mongoose.model("Notice",noticeSchema)