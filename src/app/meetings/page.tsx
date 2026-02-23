'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDate, formatTime } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Video, Users, Sun, Moon, ExternalLink, MessageSquare, QrCode, X, Lock } from 'lucide-react';
import Image from 'next/image';
import { MeetingType } from '@/types/session';
import { QRCodeSVG } from 'qrcode.react';

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
  const [selectedQRCode, setSelectedQRCode] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [timeUntilRelease, setTimeUntilRelease] = useState<string>('');

  // Check if meetings page should be available
  useEffect(() => {
    const checkAvailability = () => {
      // Set release date: March 2, 2026 at 12:00 PM Eastern Time
      // EST (Eastern Standard Time) is UTC-5
      // Create date: March 2, 2026 12:00 PM EST = March 2, 2026 17:00 UTC
      const releaseDateUTC = new Date('2026-03-02T17:00:00Z');
      
      // Get current time in UTC
      const now = new Date();
      
      // Compare times
      const available = now >= releaseDateUTC;
      setIsAvailable(available);

      if (!available) {
        const diff = releaseDateUTC.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          setTimeUntilRelease(`${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`);
        } else if (hours > 0) {
          setTimeUntilRelease(`${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`);
        } else {
          setTimeUntilRelease(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
        }
      }
    };

    checkAvailability();
    // Update every minute
    const interval = setInterval(checkAvailability, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const { data: meetings, isLoading, error } = useQuery<Meeting[]>({
    queryKey: ['meetings'],
    queryFn: async () => {
      const response = await fetch('/api/meetings');
      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }
      return response.json();
    },
    enabled: isAvailable === true, // Only fetch when available
  });

  // Show loading while checking availability
  if (isAvailable === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-blue-700 dark:text-blue-300">Checking availability...</p>
        </div>
      </div>
    );
  }

  // Show "not available yet" message if before release time
  if (!isAvailable) {
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
          <div className="max-w-2xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mb-8 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border-2 border-blue-200 dark:border-blue-800 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                  Meeting Links Coming Soon
                </h1>
                <p className="text-xl text-blue-600 dark:text-blue-400 mb-6">
                  Meeting links will be available on March 2, 2026 at 12:00 PM Eastern Time
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    Available in: {timeUntilRelease || 'Calculating...'}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Release Date: March 2, 2026 at 12:00 PM ET
                </p>
              </div>

              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  All Zoom and Teams meeting links for D79 Takeover Week will be published here once available.
                </p>
                <p className="text-sm">
                  Please check back on the release date to access all virtual meeting links.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <p className="text-red-800 dark:text-red-200 text-lg font-semibold">Error loading meetings</p>
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
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 space-y-6">
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

                        <div className="flex gap-2">
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r ${getMeetingButtonColor(meeting.meetingType)} rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2`}
                          >
                            {getMeetingIcon(meeting.meetingType)}
                            Join Meeting
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => setSelectedQRCode(meeting.meetingLink)}
                            className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                            title="Show QR Code"
                          >
                            <QrCode className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedQRCode && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedQRCode(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Scan to Join Meeting
              </h3>
              <button
                onClick={() => setSelectedQRCode(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                <QRCodeSVG
                  value={selectedQRCode}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Scan this QR code with your phone camera to join the meeting
              </p>
              
              <a
                href={selectedQRCode}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-2"
              >
                Or open link directly
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
