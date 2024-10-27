// src/types/express.d.ts
import express from "express";
import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: Partial<IUser>;
    }
  }
}
