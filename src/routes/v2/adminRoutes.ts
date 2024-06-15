import { Router } from "express";
import { createInvites } from "../../controllers/v2/adminController";
import { verifyAdminToken } from "../../middleware/authentication";

const router = Router();

router.post("/createInvite", verifyAdminToken, createInvites);

export default router;
