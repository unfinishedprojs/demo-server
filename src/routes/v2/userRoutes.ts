import { Router } from "express";
import { getUsers, createUser, login } from "../../controllers/v2/userController";

const router = Router();

router.get("/", getUsers);

router.post("/register", createUser);

router.post("/verify", login);

export default router;
