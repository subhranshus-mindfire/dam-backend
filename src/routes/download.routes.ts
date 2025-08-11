import { Router } from "express";
import {
  createDownload,
  getDownloads,
  getDownloadById,
  updateDownload,
  deleteDownload
} from "../controllers/download.controller";

const router = Router();

router.post("/", createDownload);
router.get("/", getDownloads);
router.get("/:id", getDownloadById);
router.put("/:id", updateDownload);
router.delete("/:id", deleteDownload);

export default router;
