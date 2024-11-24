import express from "express";
import { Request, Response } from "express";
import { User } from "../model/users";
import bcrypt from "bcrypt";
import { z } from "zod";
const router = express.Router();

router.post("/", async (req: any, res: any) => {
  const validate = validateUser.safeParse(req.body);
  if (!validate.success) return res.status(400).send(validate.error.errors);

  let user = await User.findOne({email:req.body.email})
  if(!user) return res.status(400).send('Invalid email or password')

const validPassword = await bcrypt.compare(req.body.password, user.password)
if (!validPassword) return res.status(400).send('Invalid email or password')

  //   @ts-ignore
const token = user.generateAuthToken();
res.send(token) 

});

const validateUser = z.object({
  email: z.string().min(3),
  password: z.string().min(3),
});

export default router;
