"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Users, Calendar, Clock, Map, PersonStanding, ArrowRight } from 'lucide-react';
import CrawlRegistrationModal from '@/components/CrawlRegistrationModal';
import CrawlMap from '@/components/CrawlMap';
import RichTextContent from '@/components/RichTextContent';
import { formatDate, formatTimeRange } from '@/lib/utils';

interface Crawl {
  id: string;
  name: string;
  location: string;
  address: string;
  date: string;
  time: string;
  endTime?: string;
  borough?: string;
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

  // Temporary: registration opens at 13:00 PM today
  const now = new Date();
  const registrationOpensAt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0, 0);
  const crawlsOpen = now >= registrationOpensAt;
  const openingDateLabel = registrationOpensAt.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleRegister = (crawl: Crawl) => {
    if (!crawlsOpen) return; // Registration not open yet
    setSelectedCrawl(crawl);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/img/asterisk.png" alt="" fill className="object-cover opacity-20" />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 relative z-10"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/img/asterisk.png" alt="" fill className="object-cover opacity-20" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-blue-800 max-w-md w-full text-center relative z-10">
          <p className="text-red-600 dark:text-red-400 font-medium">Error loading crawls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 relative overflow-hidden">
      {/* Asterisk Background Pattern */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/asterisk.png"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10">
        {/* Logos */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 max-w-4xl mx-auto">
          <Link href="/" className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 block shrink-0">
            <Image
              src="/img/d79-logo.png"
              alt="D79 Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
            <Image
              src="/img/nycpublicshools-removebg-preview.png"
              alt="NYC Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 font-semibold mb-6 sm:mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Main content card - matches homepage blue panel */}
          <div className="bg-blue-50/90 dark:bg-blue-900/80 p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl shadow-xl backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800 space-y-6 sm:space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-semibold">
                <PersonStanding className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">FEBRUARY 27, 2026</span>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800 dark:text-blue-200 tracking-tight leading-tight">
                  DISTRICT 79 SITE CRAWLS
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-blue-700 dark:text-blue-300">
                  Register for an in-person tour of our D79 locations
                </p>
              </div>

              {/* View Toggle */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 rounded-full font-semibold shadow-lg border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:scale-105"
              >
                <Map className="w-5 h-5" />
                {showMap ? 'Show List View' : 'Show Map View'}
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* NYCPS Staff Notice */}
            <div className="bg-white/80 dark:bg-gray-800/80 border-2 border-blue-200 dark:border-blue-800 p-4 sm:p-5 rounded-xl">
              <p className="text-blue-800 dark:text-blue-200 font-medium text-center text-sm sm:text-base">
                Registration is only available for NYCPS staff members with valid @schools.nyc.gov email addresses.
              </p>
            </div>

            {!crawlsOpen && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-200 dark:border-yellow-700 p-4 sm:p-5 rounded-xl">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium text-center text-sm sm:text-base">
                  Site crawl registration will open at 13:00 PM today ({openingDateLabel}). You can review locations and the schedule now; registration will be available then.
                </p>
              </div>
            )}

            {showMap ? (
              <div className="rounded-xl overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                {crawls && <CrawlMap crawls={crawls} />}
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {crawls?.map((crawl) => {
                  const spotsLeft = crawl.capacity - (crawl._count?.registrations || 0);
                  const isFullyBooked = !crawl.available || spotsLeft === 0;
                  const canRegister = crawlsOpen && !isFullyBooked;

                  return (
                    <div
                      key={crawl.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="p-5 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-200 mb-3">
                          {crawl.name}
                        </h2>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="font-medium text-blue-800 dark:text-blue-200">{crawl.location}</p>
                              <p className="text-sm">{crawl.address}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <p>{formatDate(crawl.date)}</p>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <p>{formatTimeRange(crawl.time, crawl.endTime)}</p>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <p>{spotsLeft} spots remaining</p>
                          </div>
                        </div>

                        <div className="text-gray-600 dark:text-gray-400 text-sm mb-5 line-clamp-2">
                          <RichTextContent html={crawl.description || ''} />
                        </div>

                        <button
                          onClick={() => handleRegister(crawl)}
                          disabled={!canRegister}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 disabled:grayscale"
                        >
                          {!crawlsOpen
                            ? 'Opens at 13:00 PM today'
                            : isFullyBooked
                              ? 'Fully Booked'
                              : 'Register'}
                          {canRegister && <ArrowRight className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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