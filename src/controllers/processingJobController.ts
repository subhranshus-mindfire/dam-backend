import { Request, Response } from "express";
import mongoose from "mongoose";
import { ProcessingJob } from "../models/ProcessingJob";

/**
 * Create a new processing job
 */
export const createProcessingJob = async (req: Request, res: Response) => {
  try {
    const { asset_id, job_type, status, started_at, finished_at } = req.body;

    if (!mongoose.isValidObjectId(asset_id)) {
      return res.status(400).json({ message: "Invalid asset_id" });
    }

    const job = await ProcessingJob.create({
      asset_id,
      job_type,
      status,
      started_at,
      finished_at
    });
    await job.save()
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: "Failed to create processing job", error: err });
  }
};

/**
 * Get all processing jobs
 */
export const getProcessingJobs = async (_req: Request, res: Response) => {
  const jobs = await ProcessingJob.find().lean();
  res.json(jobs);
};

/**
 * Get a processing job by ID
 */
export const getProcessingJobById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

  const job = await ProcessingJob.findById(id).lean();
  if (!job) return res.status(404).json({ message: "Processing job not found" });

  res.json(job);
};

/**
 * Update a processing job
 */
export const updateProcessingJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

  const updated = await ProcessingJob.findByIdAndUpdate(id, req.body, { new: true }).lean();
  if (!updated) return res.status(404).json({ message: "Processing job not found" });

  await updated.save()
  res.json(updated);
};

/**
 * Delete a processing job
 */
export const deleteProcessingJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

  const deleted = await ProcessingJob.findByIdAndDelete(id).lean();
  if (!deleted) return res.status(404).json({ message: "Processing job not found" });

  res.json({ message: "Processing job deleted successfully" });
};
