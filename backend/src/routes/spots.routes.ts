import { Router } from "express";
import { getStatus, hardwareUpdate, updateSpots } from "../controllers/spots.controller";

const router = Router();

router.post("/update", updateSpots);
router.post("/hardware", hardwareUpdate);
router.get("/status", getStatus);

export default router;
