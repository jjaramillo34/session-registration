'use client';

import { useState, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDate, formatTime } from '@/lib/utils';
import SessionRegistrationModal from '@/components/SessionRegistrationModal';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Users, Video, Sparkles, ArrowRight, ExternalLink, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { PROGRAM_DESCRIPTIONS } from '@/lib/constants';

interface TimeSlot {
  id: string; // MongoDB _id as string
  date: string;
  time: string;
  sessionType: 'daytime' | 'evening';
}

interface Session {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  email: string;
  programName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: 'daytime' | 'evening';
  meetingType?: 'none' | 'zoom' | 'teams';
  meetingLink?: string;
  teamsLink?: string; // Keep for backward compatibility
}

interface PageProps {
  params: Promise<{
    program: string;
  }>;
}

export default function ProgramPage({ params }: PageProps) {
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);
  const program = resolvedParams.program;
  
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: sessions, isLoading, error } = useQuery<Session[]>({
    queryKey: ['sessions', program],
    queryFn: async () => {
      if (!program) {
        throw new Error('Program ID is required');
      }
      const response = await fetch(`/api/sessions/${program}`);
      if (!response.ok) {
        throw new Error('Failed to fetch session data');
      }
      return response.json();
    },
    enabled: !!program, // Only run query when program is available
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-blue-700 dark:text-blue-300">Loading sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <p className="text-red-800 dark:text-red-200 text-lg font-semibold">Error loading session data</p>
          <Link
            href="/allprograms"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to All Programs
            </div>
            Back to All Programs
          </Link>
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

  const programName = sessions[0].programName;
  const programInfo = PROGRAM_DESCRIPTIONS[programName];

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
        {/* Back to All Programs Link */}
        <div className="mb-6">
          <Link
            href="/allprograms"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              Back to All Programs
            </div>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>FEBRUARY 23 - FEBRUARY 26, 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-blue-800 dark:text-blue-200 mb-4">
              {sessions[0].programName}
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400">
              Available Sessions for Registration
            </p>
            
            {/* Statistics */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sessions.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Total Sessions</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{daytimeSessions.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Daytime</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{eveningSessions.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Evening</div>
              </div>
            </div>

            {/* Program description */}
            {programInfo?.description && (
              <div className="mt-8 text-left max-w-3xl mx-auto">
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                  <p className="text-blue-800 dark:text-blue-200 text-base leading-relaxed">
                    {programInfo.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {programInfo.website && (
                      <a
                        href={programInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {programInfo.websiteLabel ?? 'Learn more'}
                      </a>
                    )}
                    {programInfo.website2 && (
                      <a
                        href={programInfo.website2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {programInfo.website2Label ?? 'Learn more'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sessions Grid */}
          <div className="space-y-12">
            {/* Daytime Sessions */}
            {daytimeSessions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Sun className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                      Daytime Sessions
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Open to the Public!
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {daytimeSessions.map((session) => (
                    <div
                      key={session._id || session.id}
                      className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 space-y-4 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <Calendar className="w-5 h-5" />
                          <p className="font-semibold text-lg">{formatDate(session.sessionDate)}</p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <Clock className="w-5 h-5" />
                          <p className="font-medium">{formatTime(session.sessionTime)}</p>
                        </div>
                        {(session.meetingLink || session.teamsLink) && (
                          <div className="text-sm text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                            <p className="font-medium mb-1 flex items-center gap-1">
                              <Video className="w-4 h-4" />
                              {session.meetingType === 'zoom' ? 'Zoom' : session.meetingType === 'teams' ? 'Teams' : 'Meeting'}
                            </p>
                            <a 
                              href={session.meetingLink || session.teamsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline break-all flex items-center gap-1"
                            >
                              Join Meeting
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 pt-2">
                        {(session.meetingLink || session.teamsLink) ? (
                          <>
                            <a
                              href={session.meetingLink || session.teamsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r ${
                                session.meetingType === 'zoom' 
                                  ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                                  : 'from-[#464EB8] to-[#373CA3] hover:from-[#373CA3] hover:to-[#2A2F7A]'
                              } rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2`}
                            >
                              <Video className="w-4 h-4" />
                              Join {session.meetingType === 'zoom' ? 'Zoom' : 'Teams'} Meeting
                            </a>
                            <button
                              onClick={() => handleRegister(session)}
                              className="w-full px-4 py-3 text-sm font-semibold text-[#464EB8] bg-white border-2 border-[#464EB8] rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#464EB8] transition-all duration-200"
                            >
                              Register for Updates
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRegister(session)}
                            className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            Register Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evening Sessions */}
            {eveningSessions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                    <Moon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                      Evening Sessions
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Open to the Public!
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {eveningSessions.map((session) => (
                    <div
                      key={session._id || session.id}
                      className="group bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/30 dark:to-blue-800/30 rounded-xl p-6 space-y-4 border-2 border-indigo-200 dark:border-indigo-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                          <Calendar className="w-5 h-5" />
                          <p className="font-semibold text-lg">{formatDate(session.sessionDate)}</p>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                          <Clock className="w-5 h-5" />
                          <p className="font-medium">{formatTime(session.sessionTime)}</p>
                        </div>
                        {(session.meetingLink || session.teamsLink) && (
                          <div className="text-sm text-indigo-600 dark:text-indigo-400 bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                            <p className="font-medium mb-1 flex items-center gap-1">
                              <Video className="w-4 h-4" />
                              {session.meetingType === 'zoom' ? 'Zoom' : session.meetingType === 'teams' ? 'Teams' : 'Meeting'}
                            </p>
                            <a 
                              href={session.meetingLink || session.teamsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 underline break-all flex items-center gap-1"
                            >
                              Join Meeting
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 pt-2">
                        {(session.meetingLink || session.teamsLink) ? (
                          <>
                            <a
                              href={session.meetingLink || session.teamsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r ${
                                session.meetingType === 'zoom' 
                                  ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                                  : 'from-[#2D8CFF] to-[#2681F2] hover:from-[#2681F2] hover:to-[#1E6FD9]'
                              } rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2`}
                            >
                              <Video className="w-4 h-4" />
                              Join {session.meetingType === 'zoom' ? 'Zoom' : 'Teams'} Meeting
                            </a>
                            <button
                              onClick={() => handleRegister(session)}
                              className="w-full px-4 py-3 text-sm font-semibold text-[#2D8CFF] bg-white border-2 border-[#2D8CFF] rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D8CFF] transition-all duration-200"
                            >
                              Register for Updates
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRegister(session)}
                            className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            Register Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Empty State */}
          {daytimeSessions.length === 0 && eveningSessions.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center border-2 border-blue-200 dark:border-blue-800">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                No Sessions Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                There are currently no sessions scheduled for this program.
              </p>
              <Link
                href="/allprograms"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Programs
              </Link>
            </div>
          )}
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
            id: selectedSession._id || selectedSession.id || '',
            date: selectedSession.sessionDate,
            time: selectedSession.sessionTime,
            sessionType: selectedSession.sessionType,
          }}
        />
      )}
    </div>
  );
}