import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { D79_PROGRAMS } from '@/lib/constants';

function getProgramSlug(programName: string): string {
  return programName.toLowerCase().replace(/\s+/g, '_');
}

export default function AllProgramsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 text-center mb-8">
            D79 Programs
          </h1>

          <div className="grid gap-6 md:grid-cols-2">
            {D79_PROGRAMS.map((program) => (
              <Link
                key={program}
                href={`/allprograms/${getProgramSlug(program)}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                  {program}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  View all registered sessions
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 