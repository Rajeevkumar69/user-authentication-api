import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { userRegister } from "../controllers/user.controller.js";

const userRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
userRouter.post("/register", upload.single("profileImage"), userRegister);

export default userRouter;
