import mongoose, { Schema, Document } from 'mongoose';

export interface ISignup extends Document {
  email: string;
  name: string;
  sessionId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SignupSchema = new Schema<ISignup>(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
  },
  {
    timestamps: true,
  }
);

SignupSchema.index({ sessionId: 1 });

export default mongoose.models.Signup || mongoose.model<ISignup>('Signup', SignupSchema);

