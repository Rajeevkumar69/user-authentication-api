import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcrypt';
import userModel from "../models/user.model.js";

const { CREATED, INTERNAL_SERVER_ERROR, ACCEPTED, BAD_REQUEST, FORBIDDEN, OK, REQUEST_TIMEOUT } = StatusCodes;

export const userRegister = async (req, res) => {
     try {
          const { name, email, contact, password, confirmPassword } = req.body;

          const isUserExist = await userModel.findOne({ email });
          if (isUserExist) {
               return res.status(BAD_REQUEST).json({
                    success: false,
                    status: BAD_REQUEST,
                    message: "User with same email already exist",
                    data: {}
               });
          }
          if (password !== confirmPassword) {
               return res.status(BAD_REQUEST).json({
                    success: false,
                    status: BAD_REQUEST,
                    message: "Password and Confirm password doesn't matched",
                    data: {}
               });
          }

          const hashPassword = await bcrypt.hash(password, 10)
          const newUser = new userModel({
               name: name,
               email: email,
               contact: contact,
               password: hashPassword,
               confirmPassword: confirmPassword,
               profileImage: "images/" + req.file.filename
          });
          await newUser.save();
          return res.status(CREATED).json({
               success: true,
               status: CREATED,
               message: "User registerd successfully",
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
          return res
               .status(INTERNAL_SERVER_ERROR)
               .json({
                    success: false,
                    status: INTERNAL_SERVER_ERROR,
                    message: err.message,
                    data: {}
               });
     }
}