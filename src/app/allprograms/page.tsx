'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Video, Calendar, Users, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface Program {
  _id: string;
  name: string;
}

export default function AllProgramsPage() {
  const { data: programs, isLoading, error } = useQuery<Program[]>({
    queryKey: ['programs'],
    queryFn: async () => {
      const response = await fetch('/api/programs');
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-blue-700 dark:text-blue-300">Loading programs...</p>
        </div>
      </div>
    );
  }

  if (error || !programs || programs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-red-800 dark:text-red-200 mb-4">
            {error ? 'Error loading programs' : 'No programs available'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/asterisk.png"
          alt="Background Pattern"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>FEBRUARY 23 - FEBRUARY 26, 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-blue-800 dark:text-blue-200 mb-4">
              D79 Programs
            </h1>
            <p className="text-xl text-blue-700 dark:text-blue-300">
              Explore all available programs and register for sessions
            </p>
            
            {/* Statistics */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{programs.length}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Programs</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">16</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Sessions</div>
              </div>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
              <Link
                key={program._id}
                href={`/allprograms/${program._id}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-600 relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      #{index + 1}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {program.name}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    View and register for all available sessions
                  </p>
                  
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Sessions</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-blue-50/90 dark:bg-blue-900/80 rounded-2xl p-8 shadow-xl border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                Ready to Register?
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-6">
                Click on any program above to view available sessions and register
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 