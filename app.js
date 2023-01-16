import express from "express";
import cors from "cors";
import { router } from "./router/router.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import "./ldap/ldap.js";
const app = express();
// app.use((req, res, next) => {
//   req.hostname == "192.168.8.111" ? next() : res.send("Access Denied");
// });
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://shop.agahpardazan.ir", "https://shop.agahpardazan.ir", "http://172.20.10.16"],
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);
app.listen(3001, () => console.log(`Server running in BackEnd mode on port ${3001}`));
