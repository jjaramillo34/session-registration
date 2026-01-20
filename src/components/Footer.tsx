'use client';

import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 mt-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} District 79. All rights reserved.
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <a
              href="https://www.schools.nyc.gov/learning/adult-education"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Adult Education
            </a>
            <a
              href="https://www.schools.nyc.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              NYC Schools
            </a>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <a
                href="mailto:jjaramillo7@schools.nyc.gov"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Contact Webmaster
              </a>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Having issues? Contact Javier Jaramillo at{' '}
          <a
            href="mailto:jjaramillo7@schools.nyc.gov"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
          >
            jjaramillo7@schools.nyc.gov
          </a>
        </div>
      </div>
    </footer>
  );
} 