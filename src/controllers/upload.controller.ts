import { Request, Response } from "express";
import Busboy from "busboy";
import { handleFileUpload } from "../services/upload.service";

export const uploadFiles = (req: Request, res: Response) => {
  try {
    const busboy = Busboy({ headers: req.headers });

    handleFileUpload(busboy, req, res);
    req.pipe(busboy);
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
