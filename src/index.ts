import express from "express";
const app = express();
import mongoose from "mongoose";
import users from './routes/users'
import auth from './routes/auth'
import products from './routes/products'
import carts from './routes/carts'
import order from './routes/order'
import cors from 'cors'



app.use(express.json());
app.use(cors())
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/products', products)
app.use('/api/carts', carts)
app.use('/api/order', order)





mongoose
  .connect("mongodb://127.0.0.1:27017/ecobazers")
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log("could not connect ", err));





const port = 5000;
app.listen(port, () => console.log(`listening on port ${port}`));
