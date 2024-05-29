import dotenv from "dotenv";
import connectDB from "./db/dbConnect.js";
import app from "./app.js";
import "dotenv/config";
dotenv.config();
const startServer = async () => {
  try { 
    await connectDB(); 
    console.log("Database connected successfully");

    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => { 
      console.log(`Server is running on port: ${port}`);
    });

    server.on("error", (error) => {
      console.error("Error occurred while starting the server:", error);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT signal received: closing HTTP server");
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
