import { Request, Response } from "express";
import { Download } from "../models/Download";

/**
 * @desc Create a new download record
 * @route POST /downloads
 * @access Public or Authenticated depending on use case
 */
export const createDownload = async (req: Request, res: Response) => {
  try {
    const download = await Download.create(req.body);
    res.status(201).json(download);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

/**
 * @desc Get all downloads
 * @route GET /downloads
 * @access Public or Authenticated depending on use case
 */
export const getDownloads = async (_req: Request, res: Response) => {
  try {
    const downloads = await Download.find().populate("asset_id user_id");
    res.status(200).json(downloads);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * @desc Get a single download by ID
 * @route GET /downloads/:id
 * @access Public or Authenticated depending on use case
 */
export const getDownloadById = async (req: Request, res: Response) => {
  try {
    const download = await Download.findById(req.params.id).populate("asset_id user_id");
    if (!download) {
      return res.status(404).json({ message: "Download not found" });
    }
    res.status(200).json(download);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * @desc Update a download by ID
 * @route PUT /downloads/:id
 * @access Public or Authenticated depending on use case
 */
export const updateDownload = async (req: Request, res: Response) => {
  try {
    const download = await Download.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!download) {
      return res.status(404).json({ message: "Download not found" });
    }
    res.status(200).json(download);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

/**
 * @desc Delete a download by ID
 * @route DELETE /downloads/:id
 * @access Public or Authenticated depending on use case
 */
export const deleteDownload = async (req: Request, res: Response) => {
  try {
    const download = await Download.findByIdAndDelete(req.params.id);
    if (!download) {
      return res.status(404).json({ message: "Download not found" });
    }
    res.status(200).json({ message: "Download deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
