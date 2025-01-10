import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Users, Calendar, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      
      <div className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex flex-col items-center text-center">
            {/* Logo with glow effect */}
            <div className="mb-12 relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/40 rounded-full blur-2xl" />
              <Image
                src="/img/d79-logo.png"
                alt="D79 Logo"
                fill
                className="object-contain relative z-10 drop-shadow-xl"
                priority
              />
            </div>

            {/* Main Title with gradient */}
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent">
              D79 Week Session Registration
            </h1>
            
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-16 mt-12">
              Join us for an exciting week of collaborative sessions and presentations. 
              Register now to secure your preferred time slots for both daytime and evening sessions.
            </p>

            {/* Stats/Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 w-full max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm">
                <Clock className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">30 min</span>
                <span className="text-gray-600 dark:text-gray-400">Per Session</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm">
                <Users className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">2 Types</span>
                <span className="text-gray-600 dark:text-gray-400">of Sessions</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm">
                <Calendar className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">3 Days</span>
                <span className="text-gray-600 dark:text-gray-400">Available</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm">
                <CheckCircle className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Easy</span>
                <span className="text-gray-600 dark:text-gray-400">Registration</span>
              </div>
            </div>
          </div>

          {/* Session Types */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            <div className="group p-8 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                Daytime Sessions
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Available from 11:30 AM to 1:30 PM
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Perfect for NYCPS staff presentations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  30-minute time slots
                </li>
              </ul>
            </div>

            <div className="group p-8 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                Evening Sessions
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Available from 6:00 PM to 6:30 PM
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Ideal for community members and partners
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Flexible scheduling options
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/registration"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-5 rounded-xl text-xl font-medium transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Your Registration
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-600 dark:text-gray-400">
                © 2024 District 79. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
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
                <a
                  href="mailto:support@d79.edu"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
