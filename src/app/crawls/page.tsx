"use client";

import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function CrawlsPage() {
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
            District 79 Crawls
          </h1>

          <div className="text-center mb-12">
            <p className="text-xl text-blue-700 dark:text-blue-300 mb-4">
              Join us for walking tours of our District 79 locations!
            </p>
            <p className="text-lg text-blue-600 dark:text-blue-400">
              Select an area to view the walking tour route and site information.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Manhattan Uptown Button */}
            <Link href="/crawls/manhattan-uptown">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all group">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:scale-110 transition-transform">
                    <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    Manhattan Uptown
                  </h2>
                  <p className="text-blue-600 dark:text-blue-400">
                    Harlem Renaissance HS and surrounding programs
                  </p>
                </div>
              </div>
            </Link>

            {/* Manhattan Upper East Side Button */}
            <Link href="/crawls/manhattan-upper-east">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all group">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:scale-110 transition-transform">
                    <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    Manhattan Upper East
                  </h2>
                  <p className="text-blue-600 dark:text-blue-400">
                    COOP TECH and JSK
                  </p>
                </div>
              </div>
            </Link>

            {/* Manhattan Downtown Button */}
            <Link href="/crawls/manhattan-downtown">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all group">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:scale-110 transition-transform">
                    <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    Manhattan Downtown
                  </h2>
                  <p className="text-blue-600 dark:text-blue-400">
                    Lower East Side Prep HS and Jeffrey C. Tenzer
                  </p>
                </div>
              </div>
            </Link>

            {/* Queens Jamaica Button */}
            <Link href="/crawls/queens-jamaica">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all group">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full group-hover:scale-110 transition-transform">
                    <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    Queens Jamaica
                  </h2>
                  <p className="text-blue-600 dark:text-blue-400">
                    Hillcrest HS and Jamaica Learning Center
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 