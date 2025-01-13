"use client";

import { useState } from 'react';
import { Session } from '@prisma/client';
import SignupModal from './SignupModal';

interface SessionListProps {
  sessions: Session[];
}

export default function SessionList({ sessions }: SessionListProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const daytimeSessions = sessions.filter(session => session.sessionType === 'daytime');
  const eveningSessions = sessions.filter(session => session.sessionType === 'evening');

  const handleSignupClick = (session: Session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Daytime Sessions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Daytime Sessions (NYCDOE Staff)
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {daytimeSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {session.sessionDate}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {session.sessionTime}
                </p>
              </div>
              <button
                onClick={() => handleSignupClick(session)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Evening Sessions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Evening Sessions (Community & Partners)
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {eveningSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="mb-4">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {session.sessionDate}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {session.sessionTime}
                </p>
              </div>
              <button
                onClick={() => handleSignupClick(session)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedSession && (
        <SignupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          session={selectedSession}
        />
      )}
    </div>
  );
} 