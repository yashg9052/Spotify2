import express from "express";
import dotenv from "dotenv";
import redis from "redis";
import songRoutes from "./route.js";
import cors from "cors"
dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT;
export const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD as string,
  socket: {
    host: "redis-11899.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 11899,
  },
});
redisClient
  .connect()
  .then(() => {
    console.log("Connected to redis");
  })
  .catch(console.error);
app.use("/api/v1", songRoutes);
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
