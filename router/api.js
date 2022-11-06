import express from "express";
import jwt from "jsonwebtoken";
import { Category_data, users } from "../db/datastore.js";
export const apiRouter = express.Router();
const config = process.env;

apiRouter.get("/sidebar", (req, res) => {
  res.send(Category_data);
});
