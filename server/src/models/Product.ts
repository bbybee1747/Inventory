import mongoose, { Schema, Document } from "mongoose";

// Product Interface
export interface IProduct extends Document {
  name: string;
  category: string;
  quantity: number;
  price: number;
  expirationDate?: Date;
  createdAt: Date;
}

// Product Schema
const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    expirationDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Export Model
export default mongoose.model<IProduct>("Product", ProductSchema);
