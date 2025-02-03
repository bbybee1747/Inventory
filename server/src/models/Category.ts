import mongoose, { Schema, Document } from "mongoose";

// Category Interface
export interface ICategory extends Document {
  name: string;
  description?: string;
}

// Category Schema
const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

// Export Model
export default mongoose.model<ICategory>("Category", CategorySchema);
