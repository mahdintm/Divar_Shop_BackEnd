import { users } from "../db/datastore.js";
import { sql, sql_arr } from "../db/mysql.js";
import express from "express";
import jwt from "jsonwebtoken";
import { LDAP } from "../ldap/ldap.js";
export const accountRouter = express.Router();

const config = process.env;

const createSessionToken = (userId) => {
  try {
    return jwt.sign({ id: userId }, config.TOKEN_KEY, {
      expiresIn: "1d",
    });
  } catch (error) {
    console.error("Session token creation failed");
    return null;
  }
};

accountRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const localUsers = await sql_arr(
    "select * from Users where username = ? and ldp = ?",
    [username, false]
  );
  if (localUsers === undefined) {
    return res.status(500).send({
      status: false,
    });
  }
  const user_SQL = localUsers[0];
  if (user_SQL && password == user_SQL.password) {
    const lastLoginResult = await sql(
      "update Users set lastLogin = ? where id = ?",
      [Date.now(), user_SQL.id]
    );
    if (!lastLoginResult) {
      return res.status(500).send({
        status: false,
      });
    }
    const token = createSessionToken(user_SQL.id);
    if (!token) {
      return res.status(500).send({ status: false });
    }
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    users[user_SQL.id] = true;
    res.send({
      status: true,
    });
  } else {
    let ldp;
    try {
      ldp = await LDAP.authenticate(username, password);
    } catch (error) {
      console.error("LDAP authentication service failed:", error);
      return res.status(502).send({
        status: false,
      });
    }
    if (!Array.isArray(ldp) || ldp[0] !== true || !ldp[1]?.mail) {
      return res.status(404).send({
        status: false,
      });
    }
    if (ldp[0]) {
      const ldapUsers = await sql_arr(
        "select * from Users where username = ?",
        [ldp[1].mail]
      );
      if (ldapUsers === undefined) {
        return res.status(500).send({
          status: false,
        });
      }
      if (ldapUsers.length > 0) {
        let ldp_sql = ldapUsers[0];
        const lastLoginResult = await sql(
          "update Users set lastLogin = ? where id = ?",
          [Date.now(), ldp_sql.id]
        );
        if (!lastLoginResult) {
          return res.status(500).send({
            status: false,
          });
        }
        const token = createSessionToken(ldp_sql.id);
        if (!token) {
          return res.status(500).send({ status: false });
        }
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        users[ldp_sql.id] = true;
        res.send({
          status: true,
        });
      } else {
        const registrationResult = await sql(
          "insert into Users (username, email, acl, password, ldp, firstLogin, lastLogin) values (?, ?, ?, ?, ?, ?, ?)",
          [ldp[1].mail, ldp[1].mail, "0", Date.now(), "1", Date.now(), Date.now()]
        );
        if (!registrationResult) {
          return res.status(500).send({
            status: false,
          });
        }
        const registeredUsers = await sql_arr(
          "select * from Users where username = ?",
          [ldp[1].mail]
        );
        if (!registeredUsers || registeredUsers.length === 0) {
          return res.status(500).send({
            status: false,
          });
        }
        let ldp_sql = registeredUsers[0];
        const token = createSessionToken(ldp_sql.id);
        if (!token) {
          return res.status(500).send({ status: false });
        }
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
                users[ldp_sql.id] = true;
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
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, config.TOKEN_KEY);
    if (!claims) {
      res.cookie("jwt", "", { maxAge: 0 });
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
    const dbUsers = await sql_arr(
      "select id, username, email, acl, profile, firstname, lastname, phonenumber, ldp, firstLogin, lastLogin from Users where id = ?",
      [claims.id]
    );
    if (dbUsers === undefined) {
      return res.status(500).send({
        auth: false,
      });
    }
    if (dbUsers.length === 0) {
      delete users[claims.id];
      res.cookie("jwt", "", { maxAge: 0 });
      return res.status(401).send({
        auth: false,
      });
    }
    return res.status(200).json(dbUsers[0]);
  } catch (e) {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(401).send({
      auth: false,
    });
  }
});
