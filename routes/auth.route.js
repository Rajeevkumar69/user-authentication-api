import express from "express";
import { verifyUserEmail, verifyUserEmailAPI } from "../controllers/mailer.controller.js";
import { mailVerificationValidator } from "../helpers/validation.helper.js";

const authRouter = express.Router();

authRouter.get("/verify-mail", verifyUserEmail);
authRouter.post("/verify-mail", mailVerificationValidator, verifyUserEmailAPI);

export default authRouter;