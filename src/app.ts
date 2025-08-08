import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { uploadRouter } from "./routes/upload.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRouter);

export default app;
