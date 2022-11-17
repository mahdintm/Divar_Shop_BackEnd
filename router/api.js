import express from "express";
import jwt from "jsonwebtoken";
import { Category_data, Product_Class, Product_data } from "../db/datastore.js";
import { sql } from "../db/mysql.js";
export const apiRouter = express.Router();
const config = process.env;

apiRouter.get("/sidebar", (req, res) => {
  res.send(Category_data);
});
apiRouter.get("/products", async (req, res) => {
  console.log(req.query);
  if (req.query.category) {
    console.log(1);
    res.send(Product_data.filter((a) => a.category_id == req.query.category));
    console.log(3);
  } else {
    console.log(2);
    res.send(Product_data);
  }
});
apiRouter.get("/product", (req, res) => {
  // console.log(req.query.id);
  Product_data.forEach((element) => {
    // console.log(element);
    if (element.id == req.query.id) {
      console.log("test", element);

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

apiRouter.post("/postADS", async (req, res) => {
  let data_ = req.body;
  let db_sql = await sql(`insert into Products (category_id, title, description, price, date, imgs, options)values('${req.body.category_id}','${req.body.title}','${req.body.description}','${req.body.price}','${req.body.date}','${JSON.stringify(req.body.imgs)}','${JSON.stringify(req.body.options)}')`);
  data_.registrations = [];
  data_.id = await db_sql.insertId;
  Product_Class.new_Product(data_);
  res.send({ id: db_sql.insertId });
});
