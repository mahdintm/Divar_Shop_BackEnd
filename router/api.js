import express from "express";
import jwt from "jsonwebtoken";
import { Category_data, Product_Class, Product_data, Settings } from "../db/datastore.js";
import { sql } from "../db/mysql.js";
export const apiRouter = express.Router();
const config = process.env;

apiRouter.get("/sidebar", (req, res) => {
  res.send(Category_data);
});
apiRouter.get("/products", async (req, res) => {
  if (req.query.category) {
    res.send(Product_data.filter((a) => a.category_id == req.query.category));
  } else {
    res.send(Product_data);
  }
});
apiRouter.get("/product", async (req, res) => {
  res.send(await Product_Class.getProduct(req.query.id));
});

apiRouter.get("/category", (req, res) => {
  if (req.query.id) {
    Category_data.forEach((element) => {
      if (element.id == req.query.id) {
        res.send(element);
      }
    });
  } else {
    res.send(Category_data);
  }
});
apiRouter.get("/user", async (req, res) => {
  console.log(req.query.id);
  res.send(await sql(`select * from Users where id="${req.query.id}"`));
});

apiRouter.get("/RegisterProduct", async (req, res) => {
  let sql_res = await sql(`select * from Suggestions where Product_id="${req.query.Product_id}" and User_id="${req.query.User_id}"`);
  if (sql_res != "") {
    await sql(`update Suggestions set Price="${req.query.User_Price}" where Product_id="${req.query.Product_id}" and User_id="${req.query.User_id}"`);
    res.send({ res: true });
  } else {
    await sql(`insert into Suggestions (User_id,Product_id,Price,Date) values ("${req.query.User_id}","${req.query.Product_id}","${req.query.User_Price}","${Date.now()}")`);
    res.send({ res: true });
  }
});
apiRouter.get("/removeRegisterProduct", async (req, res) => {
  await sql(`delete from Suggestions where Product_id="${req.query.Product_id}" and User_id="${req.query.User_id}"`);
  res.send({ res: true });

  // Product_data.forEach(async (element) => {
  //   if (element.id == req.query.Product_id) {
  //     if (element.registrations.find((a) => a == req.query.User_id)) {
  //       var index = await element.registrations.indexOf(req.query.User_id);
  //       if (index != -1) element.registrations.splice(index, 1);
  //       await sql(`update Products set registrations='${JSON.stringify(element.registrations)}' where id="${element.id}"`);
  //       res.send({ res: true });
  //     } else {
  //       res.send({ res: false });
  //     }
  //   }
  // });
});
apiRouter.get("/checkRegisterProduct", async (req, res) => {
  let sql_res = await sql(`select * from Suggestions where Product_id="${req.query.Product_id}" and User_id="${req.query.User_id}"`);
  if (sql_res != "") {
    res.send(true);
  } else {
    res.send(false);
  }
});
apiRouter.post("/postADS", async (req, res) => {
  let data_ = req.body;
  let db_sql = await sql(`insert into Products (category_id, title, description, price, date, imgs, options,active,code)values('${req.body.category_id}','${req.body.title}','${req.body.description}','${req.body.price}','${req.body.date}','${JSON.stringify(req.body.imgs)}','${JSON.stringify(req.body.options)}',${req.body.active},"${req.body.code}")`);
  data_.registrations = [];
  data_.id = await db_sql.insertId;
  Product_Class.new_Product(data_);
  res.send({ id: db_sql.insertId });
});
apiRouter.post("/postEdit", async (req, res) => {
  let data_ = req.body;
  let db_sql = await sql(`update Products set category_id='${req.body.category_id}',title='${req.body.title}', description='${req.body.description}', price='${req.body.price}', imgs='${JSON.stringify(req.body.imgs)}', options='${JSON.stringify(req.body.options)}',active=${req.body.active},code="${req.body.code}" where id="${req.body.id}"`);
  Product_Class.setAllData(data_.id, data_);
  res.send({ id: data_.id });
});
apiRouter.get("/deletePost", async (req, res) => {
  Product_Class.remove(req.query.id);
  res.send(true);
});

apiRouter.get("/changeStatusPost", async (req, res) => {
  res.send(Product_Class.changeStatus(req.query.id, req.query.status));
});

apiRouter.get("/registerTime", async (req, res) => {
  let RG_ST = await Settings.get("RegisterTime");
  let Time = Date.now();
  if (RG_ST.start <= Time && RG_ST.end >= Time) {
    res.send(true);
  } else {
    res.send(false);
  }
});
apiRouter.get("/getRegisterTime", async (req, res) => {
  let RG_ST = await Settings.get("RegisterTime");
  res.send(RG_ST);
});
apiRouter.get("/setRegisterTime_End", async (req, res) => {
  let RG_ST = await Settings.get("RegisterTime");
  let RG_ST_ = await Settings.set("RegisterTime", { start: RG_ST.start, end: JSON.parse(req.query.Time) });
  res.send(RG_ST_);
});
apiRouter.get("/setRegisterTime_Start", async (req, res) => {
  let RG_ST = await Settings.get("RegisterTime");
  let RG_ST_ = await Settings.set("RegisterTime", { start: JSON.parse(req.query.Time), end: RG_ST.end });
  res.send(RG_ST_);
});
apiRouter.get("/getAllUsers", async (req, res) => {
  let users__ = await sql(`select id,username,email,acl,profile,firstname,lastname,phonenumber,ldp,firstLogin,lastLogin from Users`);
  res.send(users__);
});

apiRouter.get("/RunMozaiede", async (req, res) => {
  try {
    let Suggestions___ = await sql(`select * from Suggestions`);
    let SUG = {};
    for await (const element of Suggestions___) {
      if (SUG[element.Product_id] != undefined) {
        SUG[element.Product_id].push(element);
      } else {
        SUG[element.Product_id] = [];
        SUG[element.Product_id].push(element);
      }
    }
    Object.entries(SUG).filter(async (v, index, ar) => {
      await SUG[v[0]].sort((a, b) => b.Price - a.Price);
      let i = 0;
      let len = SUG[v[0]].length >= 4 ? 4 : SUG[v[0]].length;
      for (let i = 0; i < len; i++) {
        Product_data.forEach(async (element) => {
          if (element.id == v[0]) {
            if (element.registrations.length != 4 && !element.registrations.find((a) => a.id == SUG[v[0]][i].User_id)) {
              await element.registrations.push({ id: SUG[v[0]][i].User_id, price: SUG[v[0]][i].Price });
              await sql(`update Products set registrations='${JSON.stringify(element.registrations)}' where id="${element.id}"`);
            }
          }
        });
      }
    });
    res.send([true]);
  } catch (error) {
    res.send([false, error]);
  }
});
