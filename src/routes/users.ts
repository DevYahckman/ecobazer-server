import express, { Request, Response } from "express";
import { User, validateUser } from "../model/users";
import bcrypt from "bcrypt";
import _ from "lodash";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.post("/", async (req: any, res: any) => {
  const validate = validateUser.safeParse(req.body);

  if (!validate.success) return res.status(400).send(validate.error.errors);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exist");

  user = new User({
    fullname: req.body.fullname,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    isAdmin: false,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(
      _.pick(user, [
        "_id",
        "fullname",
        "phone",
        "email",
        "address",
        "isAdmin",
        "createdAt",
      ])
    );
});

router.patch("/:id", async (req: any, res: any) => {
  let user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        fullname: req.body.fullname,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        isAdmin: req.body.isAdmin,
      },
    },
    { new: true }
  );

  if (!user) return res.status(404).send("User not found");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  res.status(200).send(user);
});

router.delete("/:id", async (req: any, res: any) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).send("User not found ");
  res.send(`deleted succefully ${user}`);
});

export default router;
