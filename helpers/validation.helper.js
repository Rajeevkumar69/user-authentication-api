import { check } from "express-validator";
import UserModel from "../models/user.model.js";

export const validationHelper = [
     check("name", "Name is required").not().isEmpty(),
     check("email", "Please enter a valid email")
          .isEmail()
          .normalizeEmail({ gmail_remove_dots: true })
          .custom(async value => {
               const existingUser = await UserModel.findOne({ email: value });
               if (existingUser) throw new Error("User with same email already exists");
               return true;
          }),
     check("contact", "Contact number must contain 10 digits").isLength({
          min: 10,
          max: 10
     }),
     check("password", "Please enter a valid password").isStrongPassword({
          minLength: 6,
          minUppercase: 1,
          minLowercase: 1
     }),
     check("confirmPassword", "Passwords do not match").custom(
          (value, { req }) => value === req.body.password
     ),
     check("profileImage")
          .custom((value, { req }) => {
               if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/png") {
                    return true;
               }
               return false;
          })
          .withMessage("Please upload an image JPEG or PNG")
];

export const mailVerificationValidator = [
     check("email", "Please enter a valid email").isEmail().normalizeEmail({ gmail_remove_dots: true })
];
