import { Request, Response } from "express";
import { Analytics } from "../models/Analytics";
import { Types } from "mongoose";

/**
 * Create new analytics record
 */
export const createAnalytics = async (req: Request, res: Response) => {
  try {
    const { asset_id, view_count, download_count, last_viewed_at } = req.body;

    if (!asset_id || !Types.ObjectId.isValid(asset_id)) {
      return res.status(400).json({ message: "invalid asset_id is required" });
    }

    const analytics = await Analytics.create({
      asset_id,
      view_count,
      download_count,
      last_viewed_at
    });

    res.status(201).json(analytics);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * Get analytics by ID
 */
export const getAnalyticsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const analytics = await Analytics.findById(id);
    if (!analytics) {
      return res.status(404).json({ message: "Analytics not found" });
    }

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * Update analytics by ID
 */
export const updateAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const analytics = await Analytics.findByIdAndUpdate(id, req.body, { new: true });
    if (!analytics) {
      return res.status(404).json({ message: "Analytics not found" });
    }

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * Delete analytics by ID
 */
export const deleteAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const analytics = await Analytics.findByIdAndDelete(id);
    if (!analytics) {
      return res.status(404).json({ message: "Analytics not found" });
    }

    res.json({ message: "Analytics deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
