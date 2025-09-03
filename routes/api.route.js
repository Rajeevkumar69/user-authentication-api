import express from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";

const apiRouter = express.Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;