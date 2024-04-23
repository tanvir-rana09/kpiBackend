import "dotenv/config";
import connectDB from "./db/dbConnect.js";
import app from "./app.js";

connectDB()
  .then(() => {
    console.log("Database Connect successfully");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server at running in port : ", process.env.PORT);
    });
    app.on("error", () => {
      console.log("Got some error while listing the URI");
    });
  })
  .catch((error) => {
    console.log("Database not connecting!");
  });
