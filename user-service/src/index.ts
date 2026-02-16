import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import userRoutes from "./route.js";
import cors from "cors"

const connectDb = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "spotify",
    });
    console.log("MongoDb connected");
  } catch (error) {
    console.error(error);
  }
};
const app = express();
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/api/v1",userRoutes)
app.listen(port, () => {
  connectDb();

  console.log(`Listening to port ${port}`);
});
