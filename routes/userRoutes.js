import { getListPos } from "../handler/user/pos/getListPos.js";
import { updateUserPos } from "../handler/user/pos/updateUserPos.js";
import { getSelectedCard } from "../handler/user/abn/getSelectedCard.js";
import { getReadyCard } from "../handler/user/abn/getReadyCard.js";
import { getCard } from "../handler/user/abn/getCard.js";
import { exitWaitingRoom } from "../handler/user/pos/exitWaitingRoom.js";
import { checkAcc } from "../handler/user/pos/checkAcc.js";
import { getUserInfo } from "../handler/user/getUserInfo.js";
import { getSortItems } from "../handler/user/sort/getSortItems.js";
import { getSortAnswer } from "../handler/user/sort/getSortAnswer.js";
import { getAtomicItems } from "../handler/user/atomic/getAtomicItems.js";
import { getAtomicAnswer } from "../handler/user/atomic/getAtomicAnswer.js";
import { getAnswer } from "../handler/user/question/getAnswer.js";
import { getQuestion } from "../handler/user/question/getQuestion.js";

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
router.post("/sort/get-sort-items", getSortItems);
router.post("/sort/get-sort-answer", getSortAnswer);
router.post("/atomic/get-atomic-items", getAtomicItems);
router.post("/atomic/get-atomic-answer", getAtomicAnswer);
router.post("/question/get-question", getQuestion);
router.post("/question/get-answer", getAnswer);

export default router;
