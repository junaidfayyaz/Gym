import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'suspended'],
      default: 'active',
      index: true,
    },
    feePaidPKR: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'JazzCash', 'EasyPaisa', 'Bank Transfer'],
      default: 'Cash',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model('Member', memberSchema);
