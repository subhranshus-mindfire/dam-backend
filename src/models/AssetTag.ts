import { Schema, model, Document, Types } from "mongoose";

export interface IAssetTag extends Document {
  asset_id: Types.ObjectId;
  tag_id: Types.ObjectId;
}

const assetTagSchema = new Schema<IAssetTag>(
  {
    asset_id: { type: Schema.Types.ObjectId, ref: "Asset", required: true },
    tag_id: { type: Schema.Types.ObjectId, ref: "Tag", required: true }
  },
  { versionKey: false }
);

assetTagSchema.index({ asset_id: 1, tag_id: 1 }, { unique: true });

export const AssetTag = model<IAssetTag>("AssetTag", assetTagSchema);
