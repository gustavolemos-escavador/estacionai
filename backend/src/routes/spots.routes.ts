import { Router } from "express";
import { updateSpots } from "../controllers/spots.controller";

const router = Router();

router.post("/update", updateSpots);

export default router;
