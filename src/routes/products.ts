import express from "express";
import { Product, validateProducts } from "../model/products";
import _ from "lodash";
import auth from "../middlewares/auth";
import admin from "../middlewares/admin";
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

router.get("/:id", async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).send("Product not found");
  res.send(product);
});

router.post("/", [auth, admin], async (req: any, res: any) => {
  const validate = validateProducts.safeParse(req.body);

  if (!validate.success) return res.status(400).send(validate.error.errors);

  let product = new Product(
    _.pick(req.body, [
      "name",
      "price",
      "stock",
      "category",
      "description",
      "ratings",
      "additinalInfo",
      "review",
    ])
  );

  await product.save();
  res.send(product);
});

router.patch("/:id", [auth, admin], async (req: any, res: any) => {
  let product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category,
        description: req.body.description,
        review: req.body.review,
      },
    },
    { new: true }
  );

  if (!product) return res.status(404).send("Product is unavailable");

  await product.save();
  res.status(200).send(product);
});

router.delete("/:id", [auth, admin], async (req: any, res: any) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.send(`deleted Successfully ${product}`);
});

export default router;

// router.delete("/:cartId/product/:productId", async (req, res) => {
//   const { cartId, productId } = req.params;

//   try {
//       // Find the cart and update it by removing the product
//       const cart = await Cart.findByIdAndUpdate(
//           cartId,
//           { $pull: { products: { product: productId } } }, // Removes the specific product
//           { new: true } // Return the updated document
//       );

//       if (!cart) return res.status(404).send({ message: "Cart not found" });

//       res.send({ message: "Product removed successfully", cart });
//   } catch (error) {
//       res.status(500).send({ error: error.message });
//   }
// });
