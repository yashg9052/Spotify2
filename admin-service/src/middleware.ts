import type { NextFunction, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";


interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  playlist: string;
}

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      res.status(403).json({
        message: "Please Login",
      });
      return;
    }

    const { data } = await axios.get(`${process.env.User_URL}/api/v1/user/me`, {
      headers: {
        token,
      },
    });

    req.user = data;

    next();
  } catch (error) {
    res.status(403).json({
      message: "Please Login",
    });
  }
};
const storage = multer.memoryStorage()
const uploadFile =multer({storage}).single("file");
export default uploadFile