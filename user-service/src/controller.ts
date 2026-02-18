import type { Request, Response } from "express";
import TryCatch from "./TryCatch.js";
import { User } from "./model.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { AuthenticatedRequest } from "./middlware.js";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    res.status(400).json({
      message: "User already exists",
    });
    return;
  }
  const hashpassword = await bcrypt.hash(password, 10);
  user = await User.create({ name, email, password: hashpassword });
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  res.status(201).json({
    message:"User created Succesfullly",
    user,token
  })
});
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({
      message: "User not exists",
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400).json({
      message: "Invalid Password",
    });
    return;
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.status(200).json({
    message: "Logged IN",
    user,
    token,
  });
});
export const getProfile=TryCatch((req:AuthenticatedRequest,res)=>{
  const user = req.user;

  res.json(user)
})
export const addToPlaylist = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const songId = req.params.id;

    if (!songId || typeof songId !== "string") {
      res.status(400).json({
        message: "Invalid song id",
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        message: "No user with this id",
      });
      return;
    }

    if (user.playlist.includes(songId)) {
      const index = user.playlist.indexOf(songId);
      user.playlist.splice(index, 1);
      await user.save();

      res.json({
        message: "Removed from playlist",
      });
      return;
    }

    user.playlist.push(songId);
    await user.save();

    res.json({
      message: "Added to Playlist",
    });
  }
);
