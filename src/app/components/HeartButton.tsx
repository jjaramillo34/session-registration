"use client";

import Link from 'next/link';

export default function HeartButton() {
  return (
    <Link href="/register">
      <div className="relative group cursor-pointer">
        <div className="heart-shape relative w-full aspect-square max-w-[300px] mx-auto transform hover:scale-105 transition-all duration-300">
          {/* Heart background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-90 group-hover:opacity-100 group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 heart-shape-bg shadow-xl" />
          
          {/* Content container */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white z-10">
            <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
              FEBRUARY 14
            </h3>
            <p className="text-lg font-bold drop-shadow-lg">
              DISTRICT 79
            </p>
            <p className="text-lg font-bold drop-shadow-lg">
              CRAWLS!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .heart-shape {
          clip-path: path('M24,12 C24,7.58172 20.4183,4 16,4 C13.4976,4 11.2962,5.19089 9.99999,7.07086 C8.70377,5.19089 6.50238,4 4,4 C-0.418278,4 -4,7.58172 -4,12 C-4,17.4183 1.58172,22 7,22 C9.50238,22 11.7038,20.8091 13,18.9291 C14.2962,20.8091 16.4976,22 19,22 C24.4183,22 29,17.4183 29,12 Z');
          transform-origin: center;
        }
        .heart-shape-bg {
          clip-path: path('M24,12 C24,7.58172 20.4183,4 16,4 C13.4976,4 11.2962,5.19089 9.99999,7.07086 C8.70377,5.19089 6.50238,4 4,4 C-0.418278,4 -4,7.58172 -4,12 C-4,17.4183 1.58172,22 7,22 C9.50238,22 11.7038,20.8091 13,18.9291 C14.2962,20.8091 16.4976,22 19,22 C24.4183,22 29,17.4183 29,12 Z');
          transform-origin: center;
        }
      `}</style>
    </Link>
  );
} 