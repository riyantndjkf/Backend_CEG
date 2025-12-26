import { login } from "../handler/auth/login.js";
import { register } from "../handler/auth/register.js";
import { checkStatusPendaftaran } from "../handler/user/checkStatusPembayaran.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/check-status-pendaftaran", checkStatusPendaftaran);

export default router;
