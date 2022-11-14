import express from "express";
import jwt from "jsonwebtoken";
import { Category_data, Product_data } from "../db/datastore.js";
import { sql } from "../db/mysql.js";
export const apiRouter = express.Router();
const config = process.env;

apiRouter.get("/sidebar", (req, res) => {
  res.send(Category_data);
});
apiRouter.get("/products", (req, res) => {
  res.send(Product_data);
});
apiRouter.get("/product", (req, res) => {
  Product_data.forEach((element) => {
    if (element.id == req.query.id) {
      res.send(element);
    }
  });
});

apiRouter.get("/category", (req, res) => {
  console.log(req.url);
  Category_data.forEach((element) => {
    if (element.id == req.query.id) {
      res.send(element);
    }
  });
});
apiRouter.get("/user", async (req, res) => {
  res.send(await sql(`select * from Users where id="${req.query.id}"`));
});
