import { Schema, model, Document, Types } from "mongoose";

export interface IProcessingJob extends Document {
  asset_id: Types.ObjectId;
  job_type?: string;
  status?: string;
  started_at?: Date;
  finished_at?: Date;
}

const processingJobSchema = new Schema<IProcessingJob>(
  {
    asset_id: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    job_type: { type: String },
    status: { type: String },
    started_at: { type: Date },
    finished_at: { type: Date }
  },
  { versionKey: false }
);

export const ProcessingJob = model<IProcessingJob>(
  "ProcessingJob",
  processingJobSchema
);
