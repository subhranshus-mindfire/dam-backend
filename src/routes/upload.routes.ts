import { Router } from "express";
import { uploadFiles } from "../controllers/upload.controller";

const uploadRouter = Router();

uploadRouter.post("/", uploadFiles);

export default uploadRouter
