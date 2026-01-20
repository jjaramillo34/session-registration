import mongoose, { Schema, Document } from 'mongoose';
import { RegistrationStatus } from '@/types/registration';

export interface ICrawlRegistration extends Document {
  name: string;
  email: string;
  crawlId: mongoose.Types.ObjectId;
  status: RegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CrawlRegistrationSchema = new Schema<ICrawlRegistration>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    crawlId: { type: Schema.Types.ObjectId, ref: 'Crawl', required: true },
    status: { type: String, enum: ['CONFIRMED', 'CANCELLED'], default: 'CONFIRMED' },
  },
  {
    timestamps: true,
  }
);

CrawlRegistrationSchema.index({ email: 1 });
CrawlRegistrationSchema.index({ crawlId: 1 });

export default mongoose.models.CrawlRegistration || mongoose.model<ICrawlRegistration>('CrawlRegistration', CrawlRegistrationSchema);

