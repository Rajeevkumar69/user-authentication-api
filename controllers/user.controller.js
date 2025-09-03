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