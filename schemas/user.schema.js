import mongoose from "mongoose";

const userSchema = mongoose.Schema({
     name: { type: String, required: true },
     email: { type: String, required: true, unique:true },
     contact: { type: String, required: true },
     profileImage: { type: String, required: true },
     password: { type: String, required: true },
     confirmPassword: { type: String, required: true },
     isVerified: { type: Number, default:0 },

}, { timestamp: true });


export default userSchema;