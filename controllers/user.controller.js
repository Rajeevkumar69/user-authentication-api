import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../models/user.model.js";
import sendMail from "../helpers/mailer.js";

const { CREATED, INTERNAL_SERVER_ERROR, BAD_REQUEST } = StatusCodes;

export const userRegister = async (req, res) => {
     try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
               return res.status(BAD_REQUEST).json({
                    success: false,
                    status: BAD_REQUEST,
                    message: errors.array().map(err => err.msg)
               });
          }

          const { name, email, contact, password, confirmPassword } = req.body;
          const hashPassword = await bcrypt.hash(password, 10);

          const newUser = new UserModel({
               name,
               email,
               contact,
               password: hashPassword,
               confirmPassword,
               profileImage: "images/" + req.file.filename
          });
          await newUser.save();

          const message = `
      <p>Hello ${name}, Thanks for registering.
      Please verify your mail <a href="http://localhost:4800/verify-mail?id=${newUser._id}">Verify</a>
      </p>
    `;
          await sendMail(email, "User Authentication", message);

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
