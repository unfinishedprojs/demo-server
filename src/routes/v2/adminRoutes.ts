import { Router } from "express";
import { createInvites, deleteEvent, getSuggestionCount } from "../../controllers/v2/adminController";
import { verifyAdminToken } from "../../middleware/authentication";

const router = Router();

router.post("/createInvite", verifyAdminToken, createInvites);

router.post("/getSuggestionCount", verifyAdminToken, getSuggestionCount);

router.post("/deleteevent", verifyAdminToken, deleteEvent);

export default router;
