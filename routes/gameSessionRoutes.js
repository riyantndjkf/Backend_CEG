import {createGameSession} from "../handler/game_session/createGameSession.js";
import express from "express";

const router = express.Router();

router.get("/create", createGameSession);

export default router;
