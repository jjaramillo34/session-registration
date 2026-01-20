import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeSlot extends Document {
  date: string;
  time: string;
  capacity: number;
  available: boolean;
  sessionType: string;
  createdAt: Date;
  updatedAt: Date;
}

const TimeSlotSchema = new Schema<ITimeSlot>(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    capacity: { type: Number, default: 2 },
    available: { type: Boolean, default: true },
    sessionType: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create compound index for unique date+time combination
TimeSlotSchema.index({ date: 1, time: 1 }, { unique: true });
TimeSlotSchema.index({ sessionType: 1 });
TimeSlotSchema.index({ available: 1 });

export default mongoose.models.TimeSlot || mongoose.model<ITimeSlot>('TimeSlot', TimeSlotSchema);

