import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { userRegister } from "../controllers/user.controller.js";
import { validationHelper } from "../helpers/validation.helper.js";

const userRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
               cb(null, path.join(__dirname, "../public/images"));
          }
     },
     filename: (req, file, cb) => {
          cb(null, Date.now() + "-" + file.originalname);
     }
});

const fileFilter = (req, file, cb) => {
     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
          cb(null, true);
     } else {
          cb(null, false);
     }
};

const upload = multer({ storage, fileFilter });

userRouter.post("/register", upload.single("profileImage"), validationHelper, userRegister);

export default userRouter;
