import mongoose, { Schema, Document } from 'mongoose';
import { Language, RegistrationStatus } from '@/types/registration';

// Re-export for backward compatibility
export { Language, RegistrationStatus };

export interface IRegistration extends Document {
  name: string;
  email: string;
  language: Language;
  programName: string;
  agencyName?: string;
  isNYCPSStaff: boolean;
  status: RegistrationStatus;
  sessionId: mongoose.Types.ObjectId;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    language: { type: String, enum: Object.values(Language), default: Language.ENGLISH },
    programName: { type: String, required: true },
    agencyName: { type: String },
    isNYCPSStaff: { type: Boolean, default: false },
    status: { type: String, enum: Object.values(RegistrationStatus), default: RegistrationStatus.CONFIRMED },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    emailSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

RegistrationSchema.index({ email: 1 });
RegistrationSchema.index({ sessionId: 1 });
RegistrationSchema.index({ emailSent: 1, status: 1 }); // For pending emails query

export default mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);

