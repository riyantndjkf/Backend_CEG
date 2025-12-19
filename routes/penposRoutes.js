import { getPos } from "../handler/penpos/getPos.js";
import express from "express";

const router = express.Router();

router.get("/get-pos", getPos);

export default router;
