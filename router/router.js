import { Router } from "express";
import { accountRouter } from "./account.js";
import { apiRouter } from "./api.js";
export const router = Router();
router.use("/api", apiRouter);
router.use("/account", accountRouter);
// router.use("/api", apiRouter);
