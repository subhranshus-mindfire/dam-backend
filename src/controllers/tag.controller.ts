import { Request, Response } from "express";
import { Tag } from "../models/Tag";

/**
 * Create a new tag
 * @route POST /tags
 */
export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const existing = await Tag.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Tag already exists" });
    }

    const tag = new Tag({ name });
    await tag.save();

    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: "Error creating tag", error });
  }
};

/**
 * Get all tags
 * @route GET /tags
 */
export const getAllTags = async (_req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tags", error });
  }
};

/**
 * Get tag by ID
 * @route GET /tags/:id
 */
export const getTagById = async (req: Request, res: Response) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tag", error });
  }
};

/**
 * Delete tag by ID
 * @route DELETE /tags/:id
 */
export const deleteTag = async (req: Request, res: Response) => {
  try {
    const deleted = await Tag.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.json({ message: "Tag deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tag", error });
  }
};
