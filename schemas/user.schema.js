import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
     {
          name: { type: String, required: true },
          email: { type: String, required: true, unique: true },
          contact: { type: String, required: true },
          profileImage: { type: String, required: true },
          password: { type: String, required: true },
          confirmPassword: { type: String, required: true },
          isVerified: { type: Number, default: 0 }
     },
     { timestamps: true }
);

export default userSchema;