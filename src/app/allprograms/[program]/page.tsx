import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { D79_PROGRAMS } from '@/lib/constants';

interface PageProps {
  params: {
    program: string;
  };
}

async function getProgramSessions(programSlug: string) {
  // Convert slug back to program name
  const programName = programSlug
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const sessions = await prisma.session.findMany({
    where: {
      programName: {
        equals: programName,
        mode: 'insensitive'
      }
    },
    orderBy: [
      { sessionDate: 'asc' },
      { sessionTime: 'asc' }
    ]
  });
  return sessions;
}

export default async function ProgramPage({ params }: PageProps) {
  const sessions = await getProgramSessions(params.program);
  
  // Convert slug back to display name
  const programName = params.program
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/allprograms"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Programs
          </Link>

          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 text-center mb-8">
            {programName} Sessions
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-8">
              {/* Daytime Sessions */}
              <div>
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                  Daytime Sessions (NYCPS Staff)
                </h2>
                <div className="grid gap-4">
                  {sessions
                    .filter(session => session.sessionType === 'daytime')
                    .map(session => (
                      <div
                        key={session.id}
                        className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-blue-800 dark:text-blue-200">
                              {session.sessionDate} at {session.sessionTime}
                            </p>
                            <p className="text-blue-600 dark:text-blue-400">
                              Presenter: {session.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  {sessions.filter(session => session.sessionType === 'daytime').length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      No daytime sessions registered yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Evening Sessions */}
              <div>
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                  Evening Sessions (Community Members)
                </h2>
                <div className="grid gap-4">
                  {sessions
                    .filter(session => session.sessionType === 'evening')
                    .map(session => (
                      <div
                        key={session.id}
                        className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-blue-800 dark:text-blue-200">
                              {session.sessionDate} at {session.sessionTime}
                            </p>
                            <p className="text-blue-600 dark:text-blue-400">
                              Presenter: {session.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  {sessions.filter(session => session.sessionType === 'evening').length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      No evening sessions registered yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 