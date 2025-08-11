import { Request, Response } from "express";
import { AssetTag } from "../models/AssetTag";

/**
 * Create a new AssetTag
 * @route POST /api/asset-tags
 */
export const createAssetTag = async (req: Request, res: Response) => {
  try {
    const assetTag = await AssetTag.create(req.body);
    await assetTag.save()
    res.status(201).json(assetTag);
  } catch (error) {
    res.status(400).json({ message: "Error creating AssetTag", error });
  }
};

/**
 * Get all AssetTags
 * @route GET /api/asset-tags
 */
export const getAllAssetTags = async (_req: Request, res: Response) => {
  try {
    const assetTags = await AssetTag.find().populate("asset_id tag_id");
    res.status(200).json(assetTags);
  } catch (error) {
    res.status(500).json({ message: "Error fetching AssetTags", error });
  }
};

/**
 * Get an AssetTag by ID
 * @route GET /api/asset-tags/:id
 */
export const getAssetTagById = async (req: Request, res: Response) => {
  try {
    const assetTag = await AssetTag.findById(req.params.id).populate("asset_id tag_id");
    if (!assetTag) {
      return res.status(404).json({ message: "AssetTag not found" });
    }
    res.status(200).json(assetTag);
  } catch (error) {
    res.status(500).json({ message: "Error fetching AssetTag", error });
  }
};

/**
 * Delete an AssetTag
 * @route DELETE /api/asset-tags/:id
 */
export const deleteAssetTag = async (req: Request, res: Response) => {
  try {
    const deleted = await AssetTag.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "AssetTag not found" });
    }
    res.status(200).json({ message: "AssetTag deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting AssetTag", error });
  }
};
