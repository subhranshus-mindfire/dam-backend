import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import uploadRoutes from "./routes/upload.routes";
import userRoutes from './routes/user.routes';
import AnalyticsRoutes from './routes/analytics.route';
import assetsRoutes from "./routes/asset.routes"
import assetTagsRoutes from "./routes/assetTag.routes"



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', AnalyticsRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/asset-tags', assetTagsRoutes);




export default app;
