import { Router } from "express";
import {
  getIEvent,
  getIEvents,
  suggest,
  voteNegative,
  votePositive,
} from "../../controllers/v2/iEventController";
import { verifyToken } from "../../middleware/authentication";

const router = Router();

router.get("/", verifyToken, getIEvents); // Get all active invite events pls tyvm
router.get("/get", verifyToken, getIEvent);

router.post("/suggest", verifyToken, suggest);

// Voting on active IEvents

router.post("/vote/positive", verifyToken, votePositive);
router.post("/vote/negative", verifyToken, voteNegative);

export default router;
