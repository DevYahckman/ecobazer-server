import mongoose from "mongoose";
import { z } from "zod";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "canclled"],
    default: "pending",
  },
  shippingAddress: { type: String, required: true },

  paymentStatus: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", orderSchema);

export const validateOrder = z.object({
  user: z.string(),
  products: z.array(
    z.object({
      product: z.string(),
      quantity: z.number(),
    })
  ),
  shippingAddress: z.string(),
});
