import { getListPos } from "../handler/user/pos/getListPos.js";
import { updateUserPos } from "../handler/user/pos/updateUserPos.js";
import { getSelectedCard } from "../handler/user/abn/getSelectedCard.js";
import { getReadyCard } from "../handler/user/abn/getReadyCard.js";
import { getCard } from "../handler/user/abn/getCard.js";
import { exitWaitingRoom } from "../handler/user/pos/exitWaitingRoom.js";
import { checkAcc } from "../handler/user/pos/checkAcc.js";
import { getUserInfo } from "../handler/user/getUserInfo.js";
import { getSortItems } from "../handler/user/sort/getSortItems.js";
import express from "express";

const router = express.Router();

router.get("/get-list-pos", getListPos);
router.put("/update-user-pos", updateUserPos);
router.post("/abn/get-card", getCard);
router.post("/abn/get-ready-card", getReadyCard);
router.post("/abn/get-selected-card", getSelectedCard);
router.get("/check-acc", checkAcc);
router.get("/exit-waiting-room", exitWaitingRoom);
router.get("/get-user-info", getUserInfo);
router.get("/sort/get-sort-items", getSortItems);

export default router;
