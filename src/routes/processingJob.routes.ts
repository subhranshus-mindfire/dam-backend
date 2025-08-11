import { Router } from "express";
import {
  createProcessingJob,
  getProcessingJobs,
  getProcessingJobById,
  updateProcessingJob,
  deleteProcessingJob
} from "../controllers/processingJobController";

const router = Router();

router.post("/", createProcessingJob);
router.get("/", getProcessingJobs);
router.get("/:id", getProcessingJobById);
router.put("/:id", updateProcessingJob);
router.delete("/:id", deleteProcessingJob);

export default router;
