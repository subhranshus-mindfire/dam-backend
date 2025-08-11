import { Schema, model, Document, Types } from "mongoose";

export interface IDownload extends Document {
  asset_id: Types.ObjectId;
  user_id: Types.ObjectId;
  downloaded_at?: Date;
}

const downloadSchema = new Schema<IDownload>(
  {
    asset_id: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    downloaded_at: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const Download = model<IDownload>("Download", downloadSchema);
