import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import uploadRoutes from "./routes/upload.routes";
import userRoutes from './routes/user.routes';
import AnalyticsRoutes from './routes/analytics.route';



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', AnalyticsRoutes);



export default app;
