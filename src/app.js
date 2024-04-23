import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

import studentRouter from "./routes/student.js";
import teacherRouter from "./routes/teacher.js";
import photoRouter from "./routes/photos.js";
import noticeRouter from "./routes/notice.js";
import userRouter from "./routes/user.js";

app.use("/api/v1/student", studentRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/photo", photoRouter);
app.use("/api/v1/notice", noticeRouter);
app.use("/api/v1/user", userRouter);

export default app;
