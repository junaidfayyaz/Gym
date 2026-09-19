import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    checkInTime: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['On-site / Physical', 'Remote / Online', 'Excused / Absent'],
      default: 'On-site / Physical',
    },
    status: {
      type: String,
      enum: ['Verified Present', 'Pending Verification', 'Excused / Absent'],
      default: 'Verified Present',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
