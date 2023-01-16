import { users } from "../db/datastore.js";
import { sql } from "../db/mysql.js";
import express from "express";
import jwt from "jsonwebtoken";
import { LDAP } from "../ldap/ldap.js";
export const accountRouter = express.Router();

const config = process.env;

accountRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user_SQL = await sql(`select * from Users where username="${username}" and ldp=${false}`);
  console.log(user_SQL)
  if (user_SQL  && password == user_SQL.password) {
    await sql(`update Users set lastLogin="${Date.now()}" where id="${user_SQL.id}"`);
    const token = jwt.sign({ id: user_SQL.id }, config.TOKEN_KEY);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    user_SQL["token"] = token;
    user_SQL["ldp"] = false;
    users[user_SQL.id] = user_SQL;
    res.send({
      status: true,
    });
  } else {
    let ldp = await LDAP.authenticate(username, password);
    console.log(ldp)
    if (ldp[0]) {
      let ldp_sql = await sql(`select * from Users where username="${ldp[1].mail}"`);
    console.log("test",ldp_sql)
      if (ldp_sql) {
        console.log(1)
        await sql(`update Users set lastLogin="${Date.now()}" where id=${ldp_sql.id}`);
        const token = jwt.sign({ id: ldp_sql.id }, config.TOKEN_KEY);
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        ldp_sql["token"] = token;
        ldp_sql["ldp"] = true;
        users[ldp_sql.id] = ldp;
        res.send({
          status: true,
        });
      } else {
        console.log(2)

        let ldp_sql_reg = await sql(`insert into Users (username,email,acl,password,ldp,firstLogin,lastLogin) values ("${ldp[1].mail}","${ldp[1].mail}","0","${Date.now()}",'1',"${Date.now()}","${Date.now()}")`);
        let ldp_sql = await sql(`select * from Users where username="${ldp[1].mail}"`);
        const token = jwt.sign({ id: ldp_sql.id }, config.TOKEN_KEY);
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        ldp_sql["token"] = token;
        ldp_sql["ldp"] = true;
        users[ldp_sql.id] = ldp;
        res.send({
          status: true,
        });
      }
    } else {
      return res.status(404).send({
        status: false,
      });
    }
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
    if (!users[claims.id]) {
      res.cookie("jwt", "", { maxAge: 0 });
      return res.status(401).send({
        auth: false,
      });
    }
    res.status(200).json({ id: claims.id });
  } catch (e) {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(401).send({
      auth: false,
    });
  }
});

accountRouter.get("/isUser", async (req, res) => {
  const cookie = req.cookies["jwt"];
  const claims = jwt.verify(cookie, config.TOKEN_KEY);
  if (!claims) {
    return res.status(401).send({
      auth: false,
    });
  }
  if (!users[claims.id]) {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(401).send({
      auth: false,
    });
  }
  res.status(200).json(await sql(`select * from Users where id="${claims.id}"`));
});
