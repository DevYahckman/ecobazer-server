import { z } from "zod";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  image: { type: String },
  otherImages: [{ type: String }],
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  ratings: { type: Number, default: 0 },
  review: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: { type: String, required: true },
      rating: { type: Number, required: true },
    },
  ],

  createdAt: { type: Date, default: Date.now },
  additinalInfo: [
    {
      weight: { type: Number },
      color: { type: String },
      type: { type: String, required: true },
      //I will use stock to send availabilty message
    },
  ],
});

export const Product = mongoose.model("Product", productSchema);

export const validateProducts = z.object({
  name: z.string().min(2),
  price: z.number().min(1),
  stock: z.number(),
  category: z.string(),
  description: z.string().min(10),
  ratings: z.number(),
});

//   review: z.object({
//     user: z.string(),
//     Comment: z.string().min(1),
//     rating: z.number(),
//   }),
//   additionalInfo: z.object({
//     wweight: z.number(),
//     color: z.string(),
//     type: z.string(),
//   }),
