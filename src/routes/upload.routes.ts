import { Router } from "express";
import { uploadFiles } from "../controllers/upload.controller";

export const uploadRouter = Router();

uploadRouter.post("/", uploadFiles);
