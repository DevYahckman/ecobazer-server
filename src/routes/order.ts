import express from "express";
import { Order, validateOrder } from "../model/order";
import { calculateTotalPrice } from "../utils/calculatetotalPrice";
const router = express.Router();

router.get("/", async (req: any, res: any) => {
    const { userId } = req.query; // Extract userId from the query string
  
    if (!userId) return res.status(400).send("userId is required");
  
    try {
      const order = await Order.find({ user: userId }).populate(
        "products.product",
        "name price"
      );
      if (!order || order.length === 0) {
        return res.status(404).send("No carts found for this user");
      }
      res.send(order);
    } catch (error) {
      res.status(500).send(error);
    }
  });

router.post("/", async (req: any, res: any) => {
  const validate = validateOrder.safeParse(req.body);

  if (!validate.success) return res.status(400).send(validate.error.errors);

  const totalPrice = await calculateTotalPrice(req.body.products);
  let order = new Order({
    user: req.body.user,
    products: req.body.products,
    totalPrice,
    shippingAddress: req.body.shippingAddress
  });

  await order.save();
  res.send(order);
});





export default router;
