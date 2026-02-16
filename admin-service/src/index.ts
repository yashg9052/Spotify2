import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
dotenv.config();
import adminRoutes from "./route.js";
import cloudinary from "cloudinary";
import redis from "redis";
import cors from "cors"
const app = express();
app.use(cors());
const PORT = process.env.PORT || 7000;
cloudinary.v2.config({
  cloud_name: process.env.Cloud_name as string,
  api_key: process.env.Cloud_Api_Key as string,
  api_secret: process.env.Cloud_Api_Secret as string,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", adminRoutes);
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

async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS albums(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

    await sql`
        CREATE TABLE IF NOT EXISTS songs(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255),
          audio VARCHAR(255) NOT NULL,
          album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initDb", error);
  }
}
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port:${PORT} `);
  });
});
