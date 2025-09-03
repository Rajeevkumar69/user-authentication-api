import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import userModel from "../models/user.model.js";
import sendMail from '../helpers/mailer.js';

const { CREATED, INTERNAL_SERVER_ERROR, ACCEPTED, BAD_REQUEST, FORBIDDEN, OK, REQUEST_TIMEOUT } = StatusCodes;

export const userRegister = async (req, res) => {
     try {
          const validUser = validationResult(req);
          if (!validUser.isEmpty()) {
               return res.status(BAD_REQUEST).json({
                    success: false,
                    status: BAD_REQUEST,
                    message: validUser.array().map(err => err.msg)
               });
          }

          const { name, email, contact, password, confirmPassword } = req.body;

          const hashPassword = await bcrypt.hash(password, 10);
          const newUser = new userModel({
               name: name,
               email: email,
               contact: contact,
               password: hashPassword,
               confirmPassword: confirmPassword,
               profileImage: "images/" + req.file.filename
          });
          await newUser.save();

          const message = `<p>Hello ${name}, Thanks for registering
                Please verify your mail <a href="http://localhost:4800/verify-mail?id=${newUser._id}">Verify</a>
           </p>`;
          await sendMail(email, 'User Authentication', message);

          return res.status(CREATED).json({
               success: true,
               status: CREATED,
               message: "User registered successfully",
               data: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    contact: newUser.contact,
                    profileImage: newUser.profileImage,
                    isVerified: newUser.isVerified
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

export const verifyUserEmail = async (req, res) => {
     try {
          const userId = req.query.id;
          const action = req.query.action;

          if (!userId) {
               return res.render("error-page");
          }

          const user = await userModel.findById(userId);
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
               await userModel.findByIdAndUpdate(userId, { $set: { isVerified: 1 } });
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