"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, MapPin, Users, Calendar, Clock, Map } from 'lucide-react';
import CrawlRegistrationModal from '@/components/CrawlRegistrationModal';
import CrawlMap from '@/components/CrawlMap';
import { formatDate, formatTime } from '@/lib/utils';

interface Crawl {
  id: number;
  name: string;
  location: string;
  address: string;
  date: string;
  time: string;
  capacity: number;
  available: boolean;
  coordinates: [number, number];
  description: string;
  _count?: {
    registrations: number;
  };
}

export default function CrawlsPage() {
  const [selectedCrawl, setSelectedCrawl] = useState<Crawl | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const { data: crawls, isLoading, error } = useQuery<Crawl[]>({
    queryKey: ['crawls'],
    queryFn: async () => {
      const response = await fetch('/api/crawls');
      if (!response.ok) {
        throw new Error('Failed to fetch crawls');
      }
      return response.json();
    },
  });

  const handleRegister = (crawl: Crawl) => {
    setSelectedCrawl(crawl);
    setIsModalOpen(true);
  };

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
          <p className="text-red-800 dark:text-red-200">Error loading crawls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 mb-4">
              D79 Site Crawls
            </h1>
            <p className="text-xl text-blue-600 dark:text-blue-400 mb-6">
              Register for an in-person tour of our D79 locations
            </p>
            
            {/* View Toggle Button */}
            <button
              onClick={() => setShowMap(!showMap)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Map className="w-5 h-5" />
              {showMap ? 'Show List View' : 'Show Map View'}
            </button>
          </div>

          {/* NYCPS Staff Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              Note: Registration is only available for NYCPS staff members with valid @schools.nyc.gov email addresses.
            </p>
          </div>

          {showMap ? (
            <div className="mb-8">
              {crawls && <CrawlMap crawls={crawls} />}
            </div>
          ) : (
            /* Crawls Grid */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {crawls?.map((crawl) => {
                const spotsLeft = crawl.capacity - (crawl._count?.registrations || 0);
                
                return (
                  <div
                    key={crawl.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                        {crawl.name}
                      </h2>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{crawl.location}</p>
                            <p className="text-sm">{crawl.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-5 h-5" />
                          <p>{formatDate(crawl.date)}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="w-5 h-5" />
                          <p>{formatTime(crawl.time)}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Users className="w-5 h-5" />
                          <p>{spotsLeft} spots remaining</p>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {crawl.description}
                      </p>

                      <button
                        onClick={() => handleRegister(crawl)}
                        disabled={!crawl.available || spotsLeft === 0}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {!crawl.available || spotsLeft === 0 ? 'Fully Booked' : 'Register'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedCrawl && (
        <CrawlRegistrationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCrawl(null);
          }}
          crawl={selectedCrawl}
        />
      )}
    </div>
  );
} 