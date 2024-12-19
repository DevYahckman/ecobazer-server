import express from "express";
import { validateCart, Cart } from "../model/carts";
import _ from "lodash";
import { calculateTotalPrice } from "../utils/calculatetotalPrice";
import auth from "../middlewares/auth";
const router = express.Router();

router.get("/", async (req: any, res: any) => {
  const { userId } = req.query; // Extract userId from the query string

  if (!userId) return res.status(400).send("userId is required");

  try {
    const carts = await Cart.find({ user: userId }).populate(
      "products.product",
      "name price"
    );
    if (!carts || carts.length === 0) {
      return res.status(404).send("No carts found for this user");
    }
    res.send(carts);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req: any, res: any) => {
  const validate = validateCart.safeParse(req.body);

  if (!validate.success) return res.status(400).send(validate.error.errors);

  try {
    const totalPrice = await calculateTotalPrice(req.body.products);
    let cart = new Cart({
      user: req.body.user,
      products: req.body.products,
      totalPrice: totalPrice,
    });

    await cart.save();
    res.send(cart);
  } catch (error) {
    res.send(error);
  }
});

router.patch("/:id", async (req: any, res: any) => {
  const totalPrice = await calculateTotalPrice(req.body.products);

  let cart = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        user: req.body.user,
        products: req.body.products,
        totalPrice: totalPrice,
      },
    },
    { new: true }
  );

  if (!cart) return res.status(400).send("Cart not found");
  await cart.save()
  res.status(201).send(cart)
});

router.delete("/:cartId/product/:productId", async (req: any, res: any) => {
  const { cartId, productId } = req.params;

  try {
    // Find the cart and update it by removing the product
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { product: productId } } },
      { new: true }
    );
    if (!cart) return res.status(404).send("Cart not found");
    res.send(`deleted Successfully ${cart}`);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
