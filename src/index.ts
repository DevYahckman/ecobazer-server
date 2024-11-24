import express from "express";
const app = express();
import mongoose from "mongoose";
import users from './routes/users'
import auth from './routes/auth'
import products from './routes/products'



app.use(express.json());
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/products', products)





mongoose
  .connect("mongodb://127.0.0.1:27017/ecobazers")
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log("could not connect ", err));





const port = 5000;
app.listen(port, () => console.log(`listening on port ${port}`));
