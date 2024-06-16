import { Router } from "express";
import { getUser, createUser, login } from "../../controllers/v2/userController";
import { verifyToken } from "../../middleware/authentication";

const router = Router();

router.get("/", verifyToken, getUser);  // Documented

router.post("/register", createUser);   // Documented

router.post("/login", login);           // Documented

export default router;
