import { Router } from "express";
import { getUser, createUser, login } from "../../controllers/v2/userController";
import { verifyToken } from "../../middleware/authentication";

const router = Router();

router.get("/", verifyToken, getUser);

router.post("/register", createUser);

router.post("/login", login);

export default router;
