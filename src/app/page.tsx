import Link from 'next/link';
import Image from 'next/image';
import { CalendarCheck, Video, Heart } from 'lucide-react';
import { Instagram, Facebook, Twitter } from 'lucide-react';


export default function Home() {
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
              src="/img/NYC logo.png"
              alt="NYC Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h2 className="text-2xl text-blue-700 dark:text-blue-300 font-bold">
              FEBRUARY 10 - FEBRUARY 14, 2025
            </h2>
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-blue-800 dark:text-blue-200">
                DISTRICT 79
              </h1>
              <h1 className="text-5xl font-bold text-blue-800 dark:text-blue-200">
                TAKEOVER
              </h1>
              <h1 className="text-5xl font-bold text-blue-800 dark:text-blue-200">
                WEEK
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-blue-50/90 dark:bg-blue-900/80 p-8 rounded-xl shadow-lg space-y-6 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200">
              JOIN US AS WE "TAKEOVER" NYC.
            </h2>
            
            <div className="space-y-4 text-lg text-blue-700 dark:text-blue-300">
              <p className="font-semibold">
                LEARN MORE ABOUT THE OPPORTUNITIES WITHIN D79!
              </p>
              <p className="font-semibold">
                OPEN TO NYCPS EMPLOYEES!
              </p>
              <p className="font-semibold">
                SPECIAL EVENING SESSIONS AVAILABLE FOR COMMUNITY MEMBERS!
              </p>
            </div>

            {/* Event Timeline */}
            <div className="mt-12 space-y-8">
              {/* Kick Off Event */}
              <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-lg shadow-md backdrop-blur-sm">
                <div className="flex items-center justify-center gap-4">
                  <CalendarCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                      KICK OFF AT TWEED
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      FEBRUARY 10 2025- 10AM-1PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Virtual Sessions and District Crawls side by side */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Virtual Sessions */}
                <Link href="/register">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 text-white group">
                    <div className="text-center space-y-4">
                      <Video className="w-12 h-12 mx-auto mb-2 transform group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-2xl font-bold mb-2">
                        FEBRUARY 11 - 13, 2025
                      </h3>
                      <div className="space-y-2">
                        <p className="text-lg">
                          D79 PROGRAM
                        </p>
                        <p className="text-xl font-bold">
                          VIRTUAL SESSIONS
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* District Crawls */}
                <Link href="/register">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 text-white group">
                    <div className="text-center space-y-4">
                      <Heart className="w-12 h-12 mx-auto mb-2 transform group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-2xl font-bold mb-2">
                        FEBRUARY 14, 2025
                      </h3>
                      <div className="space-y-2">
                        <p className="text-xl font-bold">
                          DISTRICT 79
                        </p>
                        <p className="text-xl font-bold">
                          CRAWLS!
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-block px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Register Now
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
