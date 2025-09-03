import express from "express";
import { verifyUserEmail } from "../controllers/user.controller.js";

const authRouter = express.Router();

authRouter.get('/verify-mail', verifyUserEmail);

export default authRouter;