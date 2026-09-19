import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    durationMonths: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePKR: {
      type: Number,
      required: true,
      min: 0,
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model('Plan', planSchema);
