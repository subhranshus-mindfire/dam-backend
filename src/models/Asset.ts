import { Schema, model, Document, Types } from "mongoose";

export interface IAsset extends Document {
  user_id: Types.ObjectId;
  original_filename: string;
  stored_filename: string;
  storage_url: string;
  preview_url?: string;
  thumbnail_url?: string;
  type?: string;
  created_at?: Date;
}

const assetSchema = new Schema<IAsset>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    original_filename: { type: String, required: true },
    stored_filename: { type: String, required: true },
    storage_url: { type: String, required: true },
    preview_url: { type: String },
    thumbnail_url: { type: String },
    type: { type: String },
    created_at: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const Asset = model<IAsset>("Asset", assetSchema);
