import RegistrationForm from '@/components/RegistrationForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegistrationPage() {
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
            Session Registration
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </div>
  );
} 