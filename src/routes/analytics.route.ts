import { Router } from "express";
import {
  createAnalytics,
  getAnalyticsById,
  updateAnalytics,
  deleteAnalytics
} from "../controllers/analytics.controller";

const router = Router();

router.post("/", createAnalytics);
router.get("/:id", getAnalyticsById);
router.put("/:id", updateAnalytics);
router.delete("/:id", deleteAnalytics);

export default router;