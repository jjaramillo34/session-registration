import mongoose, { Schema, Document } from 'mongoose';
import { MeetingType } from '@/types/session';

export { MeetingType };

export interface ISession extends Document {
  name: string;
  email: string;
  programName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: string;
  meetingType: MeetingType;
  meetingLink?: string;
  teamsLink?: string; // Keep for backward compatibility
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    programName: { type: String, required: true },
    sessionDate: { type: String, required: true },
    sessionTime: { type: String, required: true },
    sessionType: { type: String, required: true },
    meetingType: { 
      type: String, 
      enum: Object.values(MeetingType), 
      default: MeetingType.NONE 
    },
    meetingLink: { type: String },
    teamsLink: { type: String }, // Keep for backward compatibility
    capacity: { type: Number, default: 16 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

