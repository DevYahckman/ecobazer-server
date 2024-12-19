import mongoose from 'mongoose'
import { z } from 'zod'

const cartSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    products:[
        {
            product:{type:mongoose.Schema.Types.ObjectId, ref:'Product', required:true}, 
            quantity:{type:Number, required:true, min:1}
        }
    ],
    totalPrice:{type:Number, required:true},
    createdAt:{type:Date, default:Date.now}
})

export const Cart = mongoose.model('Cart', cartSchema )

export const validateCart = z.object({
    user:z.string(),
    products: z.array(
        z.object({
            product:z.string(),
            quantity:z.number()
        })
    ),
    // totalPrice:z.number()
})