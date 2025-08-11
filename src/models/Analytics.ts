import { Schema, model, Document, Types } from "mongoose";

export interface IAnalytics extends Document {
  asset_id: Types.ObjectId;
  view_count?: number;
  download_count?: number;
  last_viewed_at?: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    asset_id: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    view_count: { type: Number, default: 0 },
    download_count: { type: Number, default: 0 },
    last_viewed_at: { type: Date }
  },
  { versionKey: false }
);

export const Analytics = model<IAnalytics>("Analytics", analyticsSchema);
