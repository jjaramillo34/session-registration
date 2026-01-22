'use client';

import { Mail, ExternalLink, Users, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 border-t-2 border-blue-200 dark:border-blue-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              District 79
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Empowering adult learners through quality education and professional development opportunities.
            </p>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} District 79. All rights reserved.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.schools.nyc.gov/learning/adult-education"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                >
                  Adult Education
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.schools.nyc.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                >
                  NYC Public Schools
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Us
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Need Help?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                  Contact our team for assistance
                </p>
              </div>
              <div className="space-y-2">
                <a
                  href="mailto:jjaramillo7@schools.nyc.gov"
                  className="block text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors text-sm group"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <div>
                      <div className="font-medium">Javier Jaramillo</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                        jjaramillo7@schools.nyc.gov
                      </div>
                    </div>
                  </div>
                </a>
                <a
                  href="mailto:SOliger@schools.nyc.gov"
                  className="block text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors text-sm group"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <div>
                      <div className="font-medium">Stacey Oliger</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                        SOliger@schools.nyc.gov
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Having technical issues? Reach out to our support team above.
            </p>
            <p className="text-xs">
              Built with ❤️ for District 79
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 