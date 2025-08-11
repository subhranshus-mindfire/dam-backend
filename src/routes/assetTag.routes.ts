import { Router } from "express";
import {
  createAssetTag,
  getAllAssetTags,
  getAssetTagById,
  deleteAssetTag
} from "../controllers/assetTag.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AssetTags
 *   description: Asset-Tag relation management
 */
router.post("/", createAssetTag);
router.get("/", getAllAssetTags);
router.get("/:id", getAssetTagById);
router.delete("/:id", deleteAssetTag);

export default router;
