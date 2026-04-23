import { Router } from "express";
import { createAutomobile, deleteAutomobile, listAutomobiles } from "../controllers/automobile.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", listAutomobiles);
router.post("/", createAutomobile);
router.delete("/:id", deleteAutomobile);

export default router;
