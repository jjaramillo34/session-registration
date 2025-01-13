"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Navigation, Clock, School, GraduationCap } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const LOCATIONS = [
  {
    name: 'Lower East Side Preparatory HS',
    programs: ['Restart Academy'],
    address: '145 Stanton St',
    city: 'Manhattan',
    zip: '10002',
    coordinates: [-73.9841, 40.7196] as [number, number]
  },
  {
    name: 'Jeffrey C. Tenzer',
    programs: ['LYFE Program', 'Pathways to Graduation'],
    address: '198 Forsyth St',
    city: 'Manhattan',
    zip: '10002',
    coordinates: [-73.9924, 40.7222] as [number, number]
  }
];

export default function ManhattanDowntownPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routeDistance, setRouteDistance] = useState<string>('');
  const [routeDuration, setRouteDuration] = useState<string>('');
  const [routeSteps, setRouteSteps] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<typeof LOCATIONS[0] | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Calculate center point between the two locations
    const center: [number, number] = [
      (LOCATIONS[0].coordinates[0] + LOCATIONS[1].coordinates[0]) / 2,
      (LOCATIONS[0].coordinates[1] + LOCATIONS[1].coordinates[1]) / 2
    ];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 15
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Add markers for both locations
    LOCATIONS.forEach((location) => {
      const marker = new mapboxgl.Marker({ color: '#2563eb' })
        .setLngLat(location.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <h3 class="font-bold text-blue-800">${location.name}</h3>
              <p class="text-sm">${location.address}</p>
            `)
        )
        .addTo(map.current!);
    });

    // Draw route line between locations
    const fetchRoute = async () => {
      const coords = LOCATIONS.map(loc => loc.coordinates).join(';');
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${coords}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        
        // Update distance and duration
        setRouteDistance((route.distance / 1000).toFixed(2));
        setRouteDuration((route.duration / 60).toFixed(0));
        
        // Update steps
        setRouteSteps(route.legs[0].steps.map((step: any) => step.maneuver.instruction));

        // Add the route line to the map
        if (map.current?.getSource('route')) {
          (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          });
        } else {
          map.current?.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route.geometry
              }
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#2563eb',
              'line-width': 4,
              'line-dasharray': [1, 2]
            }
          });
        }
      }
    };

    fetchRoute();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const handleGetDirections = (location: typeof LOCATIONS[0]) => {
    setSelectedLocation(location);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates[1]},${location.coordinates[0]}&origin=${latitude},${longitude}&travelmode=walking`;
        window.open(url, '_blank');
      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/crawls"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Crawls
          </Link>

          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 text-center mb-8">
            Manhattan Downtown Walking Tour
          </h1>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Map Container - Takes up 3 columns */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <div ref={mapContainer} className="w-full h-[600px] rounded-lg" />
              </div>
              
              {/* Walking Stats */}
              {routeDistance && routeDuration && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                    Walking Route Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                      <Navigation className="w-5 h-5" />
                      <span>Distance: {routeDistance} km</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                      <Clock className="w-5 h-5" />
                      <span>Duration: ~{routeDuration} min</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tour Information - Takes up 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                  Tour Details
                </h2>
                <div className="prose dark:prose-invert">
                  <p className="text-blue-600 dark:text-blue-400">
                    Explore our Manhattan Downtown locations with this walking tour.
                    Visit two of our facilities and learn about the various programs we
                    offer in the Lower East Side area.
                  </p>
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mt-4">
                    What to Expect
                  </h3>
                  <ul className="list-none space-y-3">
                    <li className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                      <School className="w-5 h-5 flex-shrink-0" />
                      <span>Visit two District 79 locations</span>
                    </li>
                    <li className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                      <GraduationCap className="w-5 h-5 flex-shrink-0" />
                      <span>Learn about our Restart Academy</span>
                    </li>
                    <li className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                      <School className="w-5 h-5 flex-shrink-0" />
                      <span>Explore LYFE Program facilities</span>
                    </li>
                    <li className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                      <GraduationCap className="w-5 h-5 flex-shrink-0" />
                      <span>See Pathways to Graduation in action</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Walking Directions */}
              {routeSteps.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">
                    Walking Directions
                  </h3>
                  <ol className="list-decimal list-inside space-y-2">
                    {routeSteps.map((step, index) => (
                      <li key={index} className="text-blue-600 dark:text-blue-400">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Location Cards */}
              {LOCATIONS.map((location, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <h4 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                    {idx + 1}. {location.name}
                  </h4>
                  <div className="mt-2 space-y-1 text-blue-600 dark:text-blue-400">
                    {location.programs.map((program, pidx) => (
                      <p key={pidx} className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {program}
                      </p>
                    ))}
                    <p className="mt-2">{location.address}</p>
                    <p>{location.city}, NY {location.zip}</p>
                  </div>
                  <button
                    onClick={() => handleGetDirections(location)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions to {location.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 