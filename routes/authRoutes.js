import { login } from "../handler/auth/login.js";
import { register } from "../handler/auth/register.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

export default router;

