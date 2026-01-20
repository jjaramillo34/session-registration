'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CalendarCheck, Video, PersonStanding, Users, Clock, Calendar, ArrowRight, Sparkles, Settings } from 'lucide-react';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';


interface Program {
  _id: string;
  name: string;
}

export default function Home() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Fetch programs for statistics
  const { data: programs } = useQuery<Program[]>({
    queryKey: ['programs'],
    queryFn: async () => {
      const response = await fetch('/api/programs');
      if (!response.ok) throw new Error('Failed to fetch programs');
      return response.json();
    },
  });

  // Countdown timer
  useEffect(() => {
    const eventDate = new Date('2026-02-23T00:00:00').getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 relative overflow-hidden">
      {/* Asterisk Background Pattern */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/asterisk.png"
          alt="Background Pattern"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Logos */}
        <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
          <div className="relative w-24 h-24">
            <Image
              src="/img/d79-logo.png"
              alt="D79 Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="relative w-24 h-24">
            <Image
              src="/img/nycpublicshools-removebg-preview.png"
              alt="NYC Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Header */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>FEBRUARY 23 - FEBRUARY 26, 2026</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-6xl md:text-7xl font-bold text-blue-800 dark:text-blue-200 tracking-tight">
                DISTRICT 79
              </h1>
              <h1 className="text-6xl md:text-7xl font-bold text-blue-800 dark:text-blue-200 tracking-tight">
                TAKEOVER
              </h1>
              <h1 className="text-6xl md:text-7xl font-bold text-blue-800 dark:text-blue-200 tracking-tight">
                WEEK 
              </h1>
            </div>
            
            {/* Countdown Timer */}
            <div className="flex justify-center gap-4 mt-8">
              {timeRemaining.days > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-4 shadow-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{timeRemaining.days}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Days</div>
                </div>
              )}
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-4 shadow-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{timeRemaining.hours}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Hours</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-4 shadow-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{timeRemaining.minutes}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Minutes</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-4 shadow-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{timeRemaining.seconds}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Seconds</div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          {programs && programs.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">{programs.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Programs</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <Video className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">16</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sessions</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">4</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Days</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">8</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Evening</div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="bg-blue-50/90 dark:bg-blue-900/80 p-8 md:p-12 rounded-2xl shadow-xl space-y-8 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-blue-800 dark:text-blue-200">
                JOIN US AS WE "TAKEOVER" NYC
              </h2>
              
              <div className="space-y-3 text-lg md:text-xl text-blue-700 dark:text-blue-300">
                <p className="font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  LEARN MORE ABOUT THE OPPORTUNITIES WITHIN D79!
                </p>
                <p className="font-semibold flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  OPEN TO NYCPS EMPLOYEES!
                </p>
                <p className="font-semibold flex items-center justify-center gap-2">
                  <Video className="w-5 h-5" />
                  SPECIAL EVENING SESSIONS AVAILABLE FOR COMMUNITY MEMBERS!
                </p>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="mt-12 space-y-8">
              
              {/* Kick Off Event */}
              {/* <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-lg shadow-md backdrop-blur-sm">
                <div className="flex items-center justify-center gap-4">
                  <CalendarCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                      KICK OFF AT TWEED ROTUNDA 
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      FEBRUARY 25 2025- 10AM-1PM
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Virtual Sessions and District Crawls side by side */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Virtual Sessions */}
                <Link href="/allprograms" className="group">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 p-8 md:p-10 rounded-2xl shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="text-center space-y-4 relative z-10">
                      <Video className="w-14 h-14 mx-auto mb-2 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                      <h3 className="text-xl md:text-2xl font-bold mb-2">
                        FEBRUARY 23 - 26, 2026
                      </h3>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold">
                          D79 PROGRAM
                        </p>
                        <p className="text-2xl md:text-3xl font-bold">
                          VIRTUAL SESSIONS
                        </p>
                        <div className="pt-2">
                          <span className="inline-block text-xs bg-white/20 px-3 py-1 rounded-full">
                            NYCPS Staff & Community Members
                          </span>
                        </div>
                      </div>
                      <div className="pt-4 flex items-center justify-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Register Now <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>

                {/* District Crawls */}
                <Link href="/crawls" className="group">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 p-8 md:p-10 rounded-2xl shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="text-center space-y-4 relative z-10">
                      <PersonStanding className="w-14 h-14 mx-auto mb-2 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                      <h3 className="text-xl md:text-2xl font-bold mb-2">
                        FEBRUARY 24, 2026
                      </h3>
                      <div className="space-y-2">
                        <p className="text-2xl md:text-3xl font-bold">
                          DISTRICT 79
                        </p>
                        <p className="text-2xl md:text-3xl font-bold">
                          SITE CRAWLS!
                        </p>
                        <div className="pt-2">
                          <span className="inline-block text-xs bg-white/20 px-3 py-1 rounded-full">
                            NYCPS Staff Only
                          </span>
                        </div>
                      </div>
                      <div className="pt-4 flex items-center justify-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore Crawls <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/allprograms"
                className="group inline-flex items-center gap-3 px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                Register for Sessions
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/meetings"
                className="group inline-flex items-center gap-3 px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <Video className="w-5 h-5" />
                View All Meetings
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/crawls"
                className="group inline-flex items-center gap-3 px-8 py-4 text-xl font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-blue-600 dark:border-blue-400"
              >
                View Site Crawls
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Admin Link (for staff) */}
            <div className="mt-6 text-center">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Socials */}
      <div className="mt-12 pb-8">
        <h3 className="text-center text-xl font-bold text-blue-800 dark:text-blue-200 mb-6">
          Follow Us On Social Media
        </h3>
        <div className="flex justify-center items-center gap-8">
          <Link 
            href="https://www.d79.nyc/#" 
            target="_blank"
            className="group flex flex-col items-center gap-2 transition-transform hover:scale-110"
          >
            <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg group-hover:shadow-xl transition-all">
              <Instagram className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Instagram
            </span>
          </Link>

          <Link 
            href="https://www.facebook.com/d79takeover" 
            target="_blank"
            className="group flex flex-col items-center gap-2 transition-transform hover:scale-110"
          >
            <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg group-hover:shadow-xl transition-all">
              <Facebook className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Facebook
            </span>
          </Link>

          <Link 
            href="https://x.com/district79nyc?lang=en" 
            target="_blank"
            className="group flex flex-col items-center gap-2 transition-transform hover:scale-110"
          >
            <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg group-hover:shadow-xl transition-all">
              <Twitter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Twitter
            </span>
          </Link>
        </div>
      </div>
      
    </div>
  );
}
