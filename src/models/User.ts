import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password_hash: string;
  role?: string;
  created_at?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    password_hash: { type: String, required: true },
    role: { type: String },
    created_at: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const User = model<IUser>("User", userSchema);
