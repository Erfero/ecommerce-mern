import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ["percent", "amount"], required: true },
  value: { type: Number, required: true },
  active: { type: Boolean, default: true },
});

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
