import express, { Router } from "express";
import {
  addToPlaylist,
  getProfile,
  loginUser,
  registerUser,
} from "./controller.js";
import { isAuth } from "./middlware.js";

const router = Router();

router.post("/user/register", registerUser);
router.post("/user/Login", loginUser);
router.get("/user/me", isAuth, getProfile);
router.post("/song/:id", isAuth, addToPlaylist);
export default router;
