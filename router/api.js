import express from "express";
import jwt from "jsonwebtoken";
import { Category_data, Product_Class, Product_data, Settings } from "../db/datastore.js";
import { sql, sql_arr } from "../db/mysql.js";
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
  const product = await Product_Class.getProduct(req.query.id);
  if (!product) {
    return res.sendStatus(404);
  }
  return res.send(product);
});

apiRouter.get("/category", (req, res) => {
  if (req.query.id) {
    const category = Category_data.find((element) => element.id == req.query.id);
    if (!category) {
      return res.sendStatus(404);
    }
    return res.send(category);
  }

  res.send(Category_data);
});
apiRouter.get("/user", async (req, res) => {
  const users = await sql_arr(
    "select id, username, email, acl, profile, firstname, lastname, phonenumber, ldp, firstLogin, lastLogin from Users where id = ?",
    [req.query.id]
  );
  if (users === undefined) {
    return res.sendStatus(500);
  }
  if (users.length === 0) {
    return res.sendStatus(404);
  }
  return res.send(users[0]);
});

apiRouter.get("/RegisterProduct", async (req, res) => {
  const registrations = await sql_arr("select * from Suggestions where Product_id = ? and User_id = ?", [req.query.Product_id, req.query.User_id]);
  if (registrations === undefined) {
    return res.sendStatus(500);
  }
  if (registrations.length > 0) {

    const writeResult = await sql("update Suggestions set Price = ? where Product_id = ? and User_id = ?", [req.query.User_Price, req.query.Product_id, req.query.User_id]);
    if (!writeResult) {
      return res.sendStatus(500);
    }
    res.send({ res: true });
  } else {
    const writeResult = await sql("insert into Suggestions (User_id, Product_id, Price, Date) values (?, ?, ?, ?)", [req.query.User_id, req.query.Product_id, req.query.User_Price, Date.now()]);
    if (!writeResult) {
      return res.sendStatus(500);
    }
    res.send({ res: true });
  }
});
apiRouter.get("/removeRegisterProduct", async (req, res) => {
  const writeResult = await sql("delete from Suggestions where Product_id = ? and User_id = ?", [req.query.Product_id, req.query.User_id]);
  if (!writeResult) {
    return res.sendStatus(500);
  }
  res.send({ res: true });
});
apiRouter.get("/checkRegisterProduct", async (req, res) => {
  const registrations = await sql_arr("select * from Suggestions where Product_id = ? and User_id = ?", [req.query.Product_id, req.query.User_id]);
  if (registrations === undefined) {
    return res.sendStatus(500);
  }
  if (registrations.length > 0) {
    return res.send(true);
  }
  return res.send(false);
});
apiRouter.post("/postADS", async (req, res) => {
  let data_ = req.body;
  let db_sql = await sql("insert into Products (category_id, title, description, price, date, imgs, options, active, code) values (?, ?, ?, ?, ?, ?, ?, ?, ?)", [req.body.category_id, req.body.title, req.body.description, req.body.price, req.body.date, JSON.stringify(req.body.imgs), JSON.stringify(req.body.options), req.body.active, req.body.code]);
  if (!db_sql) {
    return res.sendStatus(500);
  }
  data_.registrations = [];
  data_.id = db_sql.insertId;
  Product_Class.new_Product(data_);
  res.send({ id: db_sql.insertId });
});
apiRouter.post("/postEdit", async (req, res) => {
  let data_ = req.body;
  let db_sql = await sql("update Products set category_id = ?, title = ?, description = ?, price = ?, imgs = ?, options = ?, active = ?, code = ? where id = ?", [req.body.category_id, req.body.title, req.body.description, req.body.price, JSON.stringify(req.body.imgs), JSON.stringify(req.body.options), req.body.active, req.body.code, req.body.id]);
  if (!db_sql) {
    return res.sendStatus(500);
  }
  if (db_sql.affectedRows === 0) {
    return res.sendStatus(404);
  }
  const cacheUpdated = await Product_Class.setAllData(data_.id, data_);
  if (!cacheUpdated) {
    return res.sendStatus(500);
  }
  res.send({ id: data_.id });
});
apiRouter.get("/deletePost", async (req, res) => {
  const result = await Product_Class.remove(req.query.id);
  if (result === null) {
    return res.sendStatus(404);
  }
  if (result === false) {
    return res.sendStatus(500);
  }
  return res.send(true);
});

apiRouter.get("/changeStatusPost", async (req, res) => {
  if (req.query.status !== "true" && req.query.status !== "false") {
    return res.sendStatus(400);
  }
  const updated = await Product_Class.changeStatus(
    req.query.id,
    req.query.status === "true"
  );
  if (updated === null) {
    return res.sendStatus(404);
  }
  if (updated === false) {
    return res.sendStatus(500);
  }
  return res.send({ res: true });
});

apiRouter.get("/registerTime", async (req, res) => {
  const RG_ST = await Settings.get("RegisterTime");
  if (!RG_ST) {
    return res.sendStatus(500);
  }
  let Time = Date.now();
  if (RG_ST.start <= Time && RG_ST.end >= Time) {
    res.send(true);
  } else {
    res.send(false);
  }
});
apiRouter.get("/getRegisterTime", async (req, res) => {
  const RG_ST = await Settings.get("RegisterTime");
  if (!RG_ST) {
    return res.sendStatus(500);
  }
  res.send(RG_ST);
});
apiRouter.get("/setRegisterTime_End", async (req, res) => {
  const time = Number(req.query.Time);
  if (!Number.isFinite(time) || time < 0) {
    return res.sendStatus(400);
  }
  const RG_ST = await Settings.get("RegisterTime");
  if (!RG_ST) {
    return res.sendStatus(500);
  }
  const RG_ST_ = await Settings.set("RegisterTime", { start: RG_ST.start, end: time });
  if (!RG_ST_) {
    return res.sendStatus(500);
  }
  res.send(RG_ST_);
});
apiRouter.get("/setRegisterTime_Start", async (req, res) => {
  const time = Number(req.query.Time);
  if (!Number.isFinite(time) || time < 0) {
    return res.sendStatus(400);
  }
  const RG_ST = await Settings.get("RegisterTime");
  if (!RG_ST) {
    return res.sendStatus(500);
  }
  const RG_ST_ = await Settings.set("RegisterTime", { start: time, end: RG_ST.end });
  if (!RG_ST_) {
    return res.sendStatus(500);
  }
  res.send(RG_ST_);
});
apiRouter.get("/getAllUsers", async (req, res) => {
  const users = await sql_arr(
    "select id,username,email,acl,profile,firstname,lastname,phonenumber,ldp,firstLogin,lastLogin from Users"
  );
  if (users === undefined) {
    return res.sendStatus(500);
  }
  return res.send(users);
});

apiRouter.get("/RunMozaiede", async (req, res) => {
  try {
    const Suggestions___ = await sql_arr("select * from Suggestions");
    if (Suggestions___ === undefined) {
      throw new Error("Suggestions query failed");
    }
    let SUG = {};
    for await (const element of Suggestions___) {
      if (SUG[element.Product_id] != undefined) {
        SUG[element.Product_id].push(element);
      } else {
        SUG[element.Product_id] = [];
        SUG[element.Product_id].push(element);
      }
    }
    for (const [productId, suggestions] of Object.entries(SUG)) {
      suggestions.sort((a, b) => b.Price - a.Price);
      const limit = suggestions.length >= 4 ? 4 : suggestions.length;
      for (let i = 0; i < limit; i++) {
        for (const element of Product_data) {
          if (element.id == productId) {
            if (
              element.registrations.length < 4 &&
              !element.registrations.find((a) => a.id == suggestions[i].User_id)
            ) {
              const updatedRegistrations = [
                ...element.registrations,
                { id: suggestions[i].User_id, price: suggestions[i].Price },
              ];
              const writeResult = await sql(
                "update Products set registrations = ? where id = ?",
                [JSON.stringify(updatedRegistrations), element.id]
              );
              if (!writeResult) {
                throw new Error(
                  `Auction registration persistence failed for product ${productId}`
                );
              }
              element.registrations = updatedRegistrations;
            }
          }
        }
      }
    }
    res.send([true]);
  } catch (error) {
    console.error("Auction processing failed:", error);
    res.send([false]);
  }
});
apiRouter.get("/count_product_register", async (req, res) => {
  const result = await sql("select count(*) from Suggestions where Product_id = ?", [req.query.productid]);
  if (result === undefined) {
    return res.sendStatus(500);
  }
  return res.send({ count: result["count(*)"] });
});

apiRouter.get("/getRegisters", async (req, res) => {
  let ress = await sql_arr("select * from Suggestions where Product_id = ?", [req.query.id]);
  if (!ress) {
    return res.sendStatus(500);
  }
  let ress_ = ress.sort((a, b) => b.Price - a.Price);
  res.send(ress_);
});
