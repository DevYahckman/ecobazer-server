import { Product } from "../model/products";

export const calculateTotalPrice = async (products: any) => {
  let totalPrice = 0;

  for (const item of products) {
    const product = await Product.findById(item.product).select("price");
    if (!product) throw new Error(`product with ID ${item.product} not found`);

    totalPrice += product.price * item.quantity;
  }

  return totalPrice
};
