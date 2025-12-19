import { getCard } from "../handler/chemicalPlantBattle/getCard.js";
import express from "express";

const router = express.Router();

router.post("/get-card", getCard);

export default router;
