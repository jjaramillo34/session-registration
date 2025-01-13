"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const LOCATION = {
  name: 'COOP TECH and JSK',
  programs: [
    'Co-op Technical High School',
    'John S. Kennedy'
  ],
  address: '321 East 96th St',
  city: 'Manhattan',
  zip: '10128',
  coordinates: [-73.9474, 40.7845] as [number, number]
};

export default function ManhattanUpperEastPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: LOCATION.coordinates,
      zoom: 15
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Add marker for the location
    new mapboxgl.Marker({ color: '#2563eb' })
      .setLngLat(LOCATION.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <h3 class="font-bold text-blue-800">${LOCATION.name}</h3>
            <p class="text-sm">${LOCATION.address}</p>
          `)
      )
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const handleGetDirections = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${LOCATION.coordinates[1]},${LOCATION.coordinates[0]}&origin=${latitude},${longitude}&travelmode=walking`;
        window.open(url, '_blank');
      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/crawls"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Crawls
          </Link>

          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 text-center mb-8">
            Manhattan Upper East Side Tour
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map Container */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div ref={mapContainer} className="w-full h-[400px] rounded-lg" />
              <button
                onClick={handleGetDirections}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Get Walking Directions
              </button>
            </div>

            {/* Tour Information */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                  Tour Details
                </h2>
                <div className="prose dark:prose-invert">
                  <p className="text-blue-600 dark:text-blue-400">
                    Visit our Manhattan Upper East Side location to explore COOP TECH and JSK facilities.
                    Learn about our technical education programs and career preparation opportunities.
                  </p>
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mt-4">
                    What to Expect
                  </h3>
                  <ul className="list-disc pl-5 text-blue-600 dark:text-blue-400">
                    <li>Tour of Co-op Technical High School facilities</li>
                    <li>Visit technical training workshops</li>
                    <li>Learn about career pathways</li>
                    <li>Meet with program instructors</li>
                  </ul>
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mt-4">
                    Location Details
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mt-2">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200">
                      {LOCATION.name}
                    </h4>
                    <div className="space-y-1 text-blue-600 dark:text-blue-400">
                      {LOCATION.programs.map((program, idx) => (
                        <p key={idx}>{program}</p>
                      ))}
                      <p className="mt-2">{LOCATION.address}</p>
                      <p>{LOCATION.city}, NY {LOCATION.zip}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 