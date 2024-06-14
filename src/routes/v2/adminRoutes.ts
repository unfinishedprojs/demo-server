import { Router } from "express";
import { createInvites } from "../../controllers/v2/adminController";

const router = Router();

router.post("/createInvite", createInvites);

export default router;
