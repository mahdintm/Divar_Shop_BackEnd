import { users } from "../db/datastore.js";
import { sql } from "../db/mysql.js";
import express from "express";
import jwt from "jsonwebtoken";
export const accountRouter = express.Router();

const config = process.env;

accountRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await sql(`select * from Users where username="${username}"`);
  if (user != "" && password == user.password) {
    const token = jwt.sign({ id: user.id }, config.TOKEN_KEY);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    user[token] = token;
    users[user.id] = user;
    res.send({
      message: "success",
    });
  } else {
    return res.status(404).send({
      message: "user not found",
    });
  }
});
accountRouter.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send({
    message: "success",
  });
});
accountRouter.get("/user", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, config.TOKEN_KEY);
    if (!claims) {
      return res.status(401).send({
        auth: false,
      });
    }
    res.status(200).json(users[claims.id]);
  } catch (e) {
    return res.status(401).send({
      auth: false,
    });
  }
});
