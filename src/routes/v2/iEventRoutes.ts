import { Router } from "express";
import {
  getIEvent,
  getIEvents,
  pollUser,
  suggest,
  voteNegative,
  votePositive,
} from "../../controllers/v2/iEventController";
import { verifyToken } from "../../middleware/authentication";

const router = Router();

router.get("/getall", verifyToken, getIEvents); // Documented
router.get("/get", verifyToken, getIEvent);     // Documented

router.post("/suggest", verifyToken, (req, res) => {
  return res.status(403).json({ message: "Suggestions are paused temporarily!" });
});  // Documented

// Voting on active IEvents

router.post("/vote/positive", verifyToken, votePositive); // Documented
router.post("/vote/negative", verifyToken, voteNegative); // Documented

export default router;
