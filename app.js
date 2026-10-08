import express from "express";
import cors from "cors";
import { router } from "./router/router.js";
import cookieParser from "cookie-parser";
import "./ldap/ldap.js";
import { datastoreReady } from "./db/datastore.js";
const app = express();
// app.use((req, res, next) => {
//   req.hostname == "192.168.8.111" ? next() : res.send("Access Denied");
// });
app.use(cookieParser());
const DEFAULT_CORS_ORIGINS = [
  "http://localhost:3000",
  "http://shop.agahpardazan.ir",
  "https://shop.agahpardazan.ir",
  "http://172.20.10.16",
];

const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : DEFAULT_CORS_ORIGINS;

app.use(
  cors({
    credentials: true,
    origin: CORS_ORIGINS,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await datastoreReady;
  app.listen(PORT, () => console.log(`Server running in BackEnd mode on port ${PORT}`));
};

startServer().catch(() => {
  process.exit(1);
});
