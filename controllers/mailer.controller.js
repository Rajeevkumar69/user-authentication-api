import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";
import UserModel from "../models/user.model.js";
import sendMail from "../helpers/mailer.js";

const { CREATED, INTERNAL_SERVER_ERROR, BAD_REQUEST } = StatusCodes;

export const verifyUserEmail = async (req, res) => {
     try {
          const userId = req.query.id;
          const action = req.query.action;

          if (!userId) return res.render("error-page");

          const user = await UserModel.findById(userId);
          if (!user) {
               return res.render("email-verification", {
                    step: "message",
                    name: "Guest",
                    message: "User Not Found"
               });
          }

          if (user.isVerified === 1) {
               return res.render("email-verification", {
                    step: "message",
                    name: user.name,
                    message: "Your email is already verified."
               });
          }

          if (action === "verify") {
               await UserModel.findByIdAndUpdate(userId, { $set: { isVerified: 1 } });
               return res.render("email-verification", {
                    step: "message",
                    name: user.name,
                    message: "Email successfully verified. We're glad to onboard you!"
               });
          }

          return res.render("email-verification", {
               step: "verify-ui",
               name: user.name,
               verifyUrl: `http://localhost:4800/verify-mail?id=${user._id}&action=verify`,
               message: ""
          });
     } catch (err) {
          return res.render("error-page");
     }
};

export const verifyUserEmailAPI = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
               return res.status(BAD_REQUEST).json({
                    success: false,
                    status: BAD_REQUEST,
                    errors: errors.array()
               });
          }

          const email = req.body.email;
          if (!email) {
               return res.status(BAD_REQUEST).json({
                    success: false,
                    status: BAD_REQUEST,
                    message: "Email is required"
               });
          }

          const user = await UserModel.findOne({ email });
          if (!user) {
               return res.status(BAD_REQUEST).json({
                    success: false,
                    status: BAD_REQUEST,
                    message: "Email does not exist"
               });
          }

          if (user.isVerified === 1) {
               return res.status(BAD_REQUEST).json({
                    success: false,
                    status: BAD_REQUEST,
                    message: "Email already verified"
               });
          }

          const message = `
      <p>Hello ${user.name},</p>
      <p>Thanks for registering. Please verify your mail by clicking the link below:</p>
      <p><a href="http://localhost:4800/verify-mail?id=${user._id}&action=verify">Verify</a></p>
    `;

          await sendMail(user.email, "Mail Verification", message);

          return res.status(CREATED).json({
               success: true,
               status: CREATED,
               message: "Verification link sent to your mail, please check",
               data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    contact: user.contact,
                    profileImage: user.profileImage,
                    isVerified: user.isVerified
               }
          });
     } catch (err) {
          return res.status(INTERNAL_SERVER_ERROR).json({
               success: false,
               status: INTERNAL_SERVER_ERROR,
               message: err.message,
               data: {}
          });
     }
};