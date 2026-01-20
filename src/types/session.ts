import mongoose from 'mongoose';

export enum MeetingType {
  NONE = 'none',
  ZOOM = 'zoom',
  TEAMS = 'teams',
}

export interface Session {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  programName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: string;
  meetingType?: MeetingType;
  meetingLink?: string;
  teamsLink?: string; // Keep for backward compatibility
  capacity?: number;
  createdAt: Date;
  updatedAt: Date;
}

