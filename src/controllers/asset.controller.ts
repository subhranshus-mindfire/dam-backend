import { Request, Response } from "express";
import { Asset } from "../models/Asset";

/**
 * Create a new asset.
 * @route POST /assets
 */
export const createAsset = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.create(req.body);
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

/**
 * Get all assets.
 * @route GET /assets
 */
export const getAssets = async (_req: Request, res: Response) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * Get asset by ID.
 * @route GET /assets/:id
 */
export const getAssetById = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * Update asset by ID.
 * @route PUT /assets/:id
 */
export const updateAsset = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json(asset);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

/**
 * Delete asset by ID.
 * @route DELETE /assets/:id
 */
export const deleteAsset = async (req: Request, res: Response) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }
    res.json({ message: "Asset deleted" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
