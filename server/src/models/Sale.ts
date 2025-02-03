import mongoose, { Schema, Document } from "mongoose";

export interface ISale extends Document {
  product: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  soldAt: Date;
}

const SaleSchema: Schema<ISale> = new Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    soldAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ISale>("Sale", SaleSchema);
 