import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cors({credentials:true}));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use((err, req, res, next) => {
	if (err instanceof ApiErrorResponse) {
		return res.status(err.status).json({
		  message: err.message,
		});
	  }
	console.error(err.stack);
	res.status(err.statusCode || 500).json({
	  success: false,
	  message: err.message || "Internal Server Error",
	  errors: err.errors || [],
	});
  });
  



import studentRouter from "./routes/student.js";
import administratorsRouter from "./routes/administrators.js";
import photoRouter from "./routes/photos.js";
import noticeRouter from "./routes/notice.js";
import userRouter from "./routes/user.js";

app.use("/api/v1/students", studentRouter);
app.use("/api/v1/administrators", administratorsRouter);
app.use("/api/v1/photo", photoRouter);
app.use("/api/v1/notice", noticeRouter);
app.use("/api/v1/user", userRouter);

export default app;
