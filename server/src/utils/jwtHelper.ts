import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(user: Partial<IUser>) {
  let payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET);
}

export function verifyToken(token: string) {
  const payload = jwt.verify(token, JWT_SECRET);
  return payload;
}
