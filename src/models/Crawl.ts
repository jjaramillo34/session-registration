import mongoose, { Schema, Document } from 'mongoose';

export interface ICrawl extends Document {
  name: string;
  location: string;
  address: string;
  date: string;
  time: string;
  capacity: number;
  available: boolean;
  coordinates: number[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const CrawlSchema = new Schema<ICrawl>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    capacity: { type: Number, default: 10 },
    available: { type: Boolean, default: true },
    coordinates: [{ type: Number }],
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

CrawlSchema.index({ date: 1, time: 1 });
CrawlSchema.index({ available: 1 });

export default mongoose.models.Crawl || mongoose.model<ICrawl>('Crawl', CrawlSchema);

