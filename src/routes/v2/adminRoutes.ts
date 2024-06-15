import { Router } from "express";
import { createInvites, getSuggestionCount } from "../../controllers/v2/adminController";
import { verifyAdminToken } from "../../middleware/authentication";

const router = Router();

router.post("/createInvite", verifyAdminToken, createInvites);

router.post("/getSuggestionCount", verifyAdminToken, getSuggestionCount);

export default router;
