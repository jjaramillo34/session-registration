'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDate, formatTime } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Video, Users, Sun, Moon, ExternalLink, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { MeetingType } from '@/types/session';

interface Meeting {
  _id: string;
  programName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: string;
  meetingType: MeetingType;
  meetingLink: string;
  capacity: number;
}

export default function MeetingsPage() {
  const { data: meetings, isLoading, error } = useQuery<Meeting[]>({
    queryKey: ['meetings'],
    queryFn: async () => {
      const response = await fetch('/api/meetings');
      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-blue-700 dark:text-blue-300">Loading meetings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <p className="text-red-800 dark:text-red-200 text-lg font-semibold">Error loading meetings</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!meetings || meetings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <Video className="w-16 h-16 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            No Meetings Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            There are currently no meetings scheduled.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mt-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Group meetings by date
  const meetingsByDate = meetings.reduce((acc, meeting) => {
    const date = meeting.sessionDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meeting);
    return acc;
  }, {} as Record<string, Meeting[]>);

  const sortedDates = Object.keys(meetingsByDate).sort();

  const getMeetingIcon = (meetingType: MeetingType) => {
    switch (meetingType) {
      case MeetingType.ZOOM:
        return <Video className="w-5 h-5" />;
      case MeetingType.TEAMS:
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  const getMeetingTypeLabel = (meetingType: MeetingType) => {
    switch (meetingType) {
      case MeetingType.ZOOM:
        return 'Zoom';
      case MeetingType.TEAMS:
        return 'Microsoft Teams';
      default:
        return 'Meeting';
    }
  };

  const getMeetingButtonColor = (meetingType: MeetingType) => {
    switch (meetingType) {
      case MeetingType.ZOOM:
        return 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
      case MeetingType.TEAMS:
        return 'from-[#464EB8] to-[#373CA3] hover:from-[#373CA3] hover:to-[#2A2F7A]';
      default:
        return 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/asterisk.png"
          alt="Background Pattern"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold mb-4">
              <Video className="w-4 h-4" />
              <span>ALL MEETINGS</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-blue-800 dark:text-blue-200 mb-4">
              Virtual Meeting Links
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400">
              Access all Zoom and Teams meetings for D79 Takeover Week
            </p>
            
            {/* Statistics */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{meetings.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Total Meetings</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {meetings.filter(m => m.meetingType === MeetingType.ZOOM).length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Zoom</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {meetings.filter(m => m.meetingType === MeetingType.TEAMS).length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Teams</div>
              </div>
            </div>
          </div>

          {/* Meetings by Date */}
          <div className="space-y-8">
            {sortedDates.map((date) => (
              <div key={date} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {formatDate(date)}
                  </h2>
                  <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {meetingsByDate[date].length} {meetingsByDate[date].length === 1 ? 'meeting' : 'meetings'}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {meetingsByDate[date]
                    .sort((a, b) => a.sessionTime.localeCompare(b.sessionTime))
                    .map((meeting) => (
                      <div
                        key={meeting._id}
                        className="group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 space-y-4 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {meeting.sessionType === 'daytime' ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                              ) : (
                                <Moon className="w-5 h-5 text-indigo-500" />
                              )}
                              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                                {meeting.sessionType}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                              {getMeetingIcon(meeting.meetingType)}
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">
                            {meeting.programName}
                          </h3>

                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Clock className="w-4 h-4" />
                            <p className="font-medium">{formatTime(meeting.sessionTime)}</p>
                          </div>

                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Platform: </span>
                            {getMeetingTypeLabel(meeting.meetingType)}
                          </div>
                        </div>

                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r ${getMeetingButtonColor(meeting.meetingType)} rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2`}
                        >
                          {getMeetingIcon(meeting.meetingType)}
                          Join {getMeetingTypeLabel(meeting.meetingType)} Meeting
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
