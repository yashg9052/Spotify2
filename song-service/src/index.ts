import express from "express";
import dotenv from "dotenv";
dotenv.config();
import songRoutes from "./route.js"
const app = express();
const PORT = process.env.PORT;
app.use("/api/v1",songRoutes)
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
