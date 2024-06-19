import { Router } from "express";
import { getUser, createUser, login } from "../../controllers/v2/userController";
import { verifyAdminToken, verifyToken } from "../../middleware/authentication";
import { createRole, getRole } from "../../controllers/v2/rolesController";

const router = Router();

router.get("/get", verifyToken, getUser);  // Documented

router.post("/register", createUser);   // Documented

router.post("/login", login);           // Documented

router.get("/role", verifyToken, getRole);

router.post("/role", verifyToken, createRole);

export default router;
