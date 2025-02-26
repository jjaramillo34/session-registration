'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDate, formatTime } from '@/lib/utils';
import SessionRegistrationModal from '@/components/SessionRegistrationModal';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Users } from 'lucide-react';

interface TimeSlot {
  id: number;
  date: string;
  time: string;
  sessionType: 'daytime' | 'evening';
}

interface Session {
  id: number;
  name: string;
  email: string;
  programName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: 'daytime' | 'evening';
  teamsLink?: string;
}

interface PageProps {
  params: {
    program: string;
  }
}

export default function ProgramPage({ params }: PageProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: sessions, isLoading, error } = useQuery<Session[]>({
    queryKey: ['sessions', params.program],
    queryFn: async () => {
      const response = await fetch(`/api/sessions/${params.program}`);
      if (!response.ok) {
        throw new Error('Failed to fetch session data');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg max-w-md w-full text-center">
          <p className="text-red-800 dark:text-red-200">Error loading session data</p>
        </div>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            No Sessions Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            There are currently no sessions scheduled for this program.
          </p>
          <Link
            href="/allprograms"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Programs
          </Link>
        </div>
      </div>
    );
  }

  const handleRegister = (session: Session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  // Group sessions by type
  const daytimeSessions = sessions.filter(session => session.sessionType === 'daytime');
  const eveningSessions = sessions.filter(session => session.sessionType === 'evening');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <Link
              href="/allprograms"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Programs
            </Link>
            <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 mb-4">
              {sessions[0].programName}
            </h1>
            <p className="text-lg text-blue-600 dark:text-blue-400">
              Available Sessions for Registration
            </p>
          </div>

          {/* Sessions Grid */}
          <div className="space-y-12">
            {/* Daytime Sessions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Morning Sessions -  (NYCPS Staff and Partner Agencies Only)
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {daytimeSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Calendar className="w-5 h-5" />
                        <p className="font-medium">{formatDate(session.sessionDate)}</p>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Clock className="w-5 h-5" />
                        <p>{formatTime(session.sessionTime)}</p>
                      </div>
                      {session.teamsLink && (
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          <p className="font-medium mb-1">Teams Meeting:</p>
                          <a 
                            href={session.teamsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline break-all"
                          >
                            Join Microsoft Teams Meeting
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {session.teamsLink ? (
                        <>
                          <a
                            href={session.teamsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#464EB8] rounded-md hover:bg-[#373CA3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#464EB8] transition-colors text-center"
                          >
                            Join Teams Meeting
                          </a>
                          <button
                            onClick={() => handleRegister(session)}
                            className="w-full px-4 py-2 text-sm font-medium text-[#464EB8] bg-white border border-[#464EB8] rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#464EB8] transition-colors"
                          >
                            Register for Updates
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRegister(session)}
                          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {daytimeSessions.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
                    No daytime sessions available.
                  </p>
                )}
              </div>
            </div>

            {/* Evening Sessions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Evening Sessions- (Open to Families, NYCPS Staff and Partner Agencies) Translation Available
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {eveningSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Calendar className="w-5 h-5" />
                        <p className="font-medium">{formatDate(session.sessionDate)}</p>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Clock className="w-5 h-5" />
                        <p>{formatTime(session.sessionTime)}</p>
                      </div>
                      {session.teamsLink && (
                        <div className="text-sm text-blue-600 dark:text-blue-400">
                          <p className="font-medium mb-1">Zoom Meeting:</p>
                          <a 
                            href={session.teamsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline break-all"
                          >
                            Join Zoom Meeting
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {session.teamsLink ? (
                        <>
                          <a
                            href={session.teamsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#2D8CFF] rounded-md hover:bg-[#2681F2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D8CFF] transition-colors text-center"
                          >
                            Join Zoom Meeting
                          </a>
                          <button
                            onClick={() => handleRegister(session)}
                            className="w-full px-4 py-2 text-sm font-medium text-[#2D8CFF] bg-white border border-[#2D8CFF] rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D8CFF] transition-colors"
                          >
                            Register for Updates
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRegister(session)}
                          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {eveningSessions.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
                    No evening sessions available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedSession && (
        <SessionRegistrationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSession(null);
          }}
          programName={selectedSession.programName}
          timeSlot={{
            id: selectedSession.id,
            date: selectedSession.sessionDate,
            time: selectedSession.sessionTime,
            sessionType: selectedSession.sessionType,
          }}
        />
      )}
    </div>
  );
}