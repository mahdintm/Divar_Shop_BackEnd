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

apiRouter.get("/RegisterProduct", async (req, res) => {
  Product_data.forEach(async (element) => {
    if (element.id == req.query.Product_id) {
      if (element.registrations.length != 4 && !element.registrations.find((a) => a == 1)) {
        await element.registrations.push(req.query.User_id);
        await sql(`update Products set registrations='${JSON.stringify(element.registrations)}' where id="${element.id}"`);
        res.send({ res: true });
      } else {
        res.send({ res: false });
      }
    }
  });
});
apiRouter.get("/removeRegisterProduct", async (req, res) => {
  Product_data.forEach(async (element) => {
    if (element.id == req.query.Product_id) {
      if (element.registrations.find((a) => a == req.query.User_id)) {
        var index = await element.registrations.indexOf(req.query.User_id);
        if (index != -1) element.registrations.splice(index, 1);
        await sql(`update Products set registrations='${JSON.stringify(element.registrations)}' where id="${element.id}"`);
        res.send({ res: true });
      } else {
        res.send({ res: false });
      }
    }
  });
});
