import { boolean, z } from "zod";
import mongoose from "mongoose";
import { IUser } from "../interfaces/interface";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema<IUser>({
  fullname: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  image: { type: String },
  createdAt:{type:Date , default:Date.now}
});

userSchema.methods.generateAuthToken= function(){
    const token = jwt.sign({_id:this.id, isAdmin:this.isAdmin}, '12345')
    return token
}

export const User = mongoose.model<IUser>("User", userSchema);

export const validateUser = z.object({
  fullname: z.string().min(3),
  email: z.string().min(3),
  phone: z.number().min(3),
  password: z.string().min(3),
  address: z.string().min(3),
});



