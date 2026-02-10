import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { stripHtml, escapeHtml } from '@/lib/utils';

// Set Mapbox token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
console.log('Mapbox Token:', MAPBOX_TOKEN); // Debug token

if (!MAPBOX_TOKEN) {
  console.error('Mapbox token is not set in environment variables');
}
mapboxgl.accessToken = MAPBOX_TOKEN || '';

interface Crawl {
  id: string;
  name: string;
  location: string;
  address: string;
  coordinates: [number, number];
  description: string;
}

interface CrawlMapProps {
  crawls: Crawl[];
}

const BOROUGH_COLORS = {
  'Manhattan': '#E41A1C', // Red
  'Brooklyn': '#377EB8',  // Blue
  'Queens': '#4DAF4A',    // Green
  'Bronx': '#984EA3',     // Purple
  'Staten Island': '#FF7F00' // Orange
};

// Add borough detection helper
const getBoroughFromLocation = (location: string, address: string): keyof typeof BOROUGH_COLORS => {
  // Normalize both location and address strings for case-insensitive matching
  const normalizedLocation = location.toLowerCase();
  const normalizedAddress = address.toLowerCase();
  const combinedText = `${normalizedLocation} ${normalizedAddress}`;
  
  console.log('Checking borough for:', { location, address });
  console.log('Normalized text:', combinedText);

  // Define borough keywords with more specific matches
  const boroughs = {
    'Queens': ['queens', 'jamaica', 'hillcrest', 'qtc', 'linden blvd', 'highland ave', 'hillside ave', '11432', '11436'],
    'Brooklyn': ['brooklyn', 'bedford', 'east new york', 'stuyvesant', 'pennsylvania ave', 'nostrand', 'marcy'],
    'Bronx': ['bronx', 'kelly st', 'polite ave'],
    'Manhattan': ['manhattan', 'harlem', 'lower east', 'upper east', 'stanton', 'forsyth', '96th st', '128th st'],
    'Staten Island': ['staten island', 'bay st']
  };

  // First, check if either location or address explicitly contains 'queens'
  if (combinedText.includes('queens')) {
    console.log('Found Queens in combined text');
    return 'Queens';
  }

  // Then check for Queens-specific keywords in both location and address
  const queensKeywords = boroughs['Queens'];
  for (const keyword of queensKeywords) {
    if (combinedText.includes(keyword)) {
      console.log(`Found Queens keyword: "${keyword}" in combined text`);
      return 'Queens';
    }
  }

  // Check other boroughs
  for (const [borough, keywords] of Object.entries(boroughs)) {
    if (borough === 'Queens') continue; // Skip Queens as we already checked it
    
    // Check both location and address for borough name or keywords
    if (combinedText.includes(borough.toLowerCase())) {
      console.log(`Found borough name: ${borough} in combined text`);
      return borough as keyof typeof BOROUGH_COLORS;
    }
    
    for (const keyword of keywords) {
      if (combinedText.includes(keyword.toLowerCase())) {
        console.log(`Found ${borough} keyword: "${keyword}" in combined text`);
        return borough as keyof typeof BOROUGH_COLORS;
      }
    }
  }

  // Log if no borough was matched
  console.log('No borough match found for:', { location, address });
  return 'Manhattan';
};

export default function CrawlMap({ crawls }: CrawlMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const flyToHandlerRef = useRef<(e: CustomEvent) => void>();

  // Add click handler for flying to location
  const handleMarkerClick = (coordinates: [number, number]) => {
    if (!map.current) return;
    
    map.current.flyTo({
      center: coordinates,
      zoom: 14,
      duration: 2000, // Animation duration in milliseconds
      essential: true
    });
  };

  useEffect(() => {
    console.log('CrawlMap mounting...'); // Debug mounting

    if (!mapContainer.current) {
      console.error('Map container not found');
      return;
    }

    if (!MAPBOX_TOKEN) {
      setMapError('Mapbox token is not configured');
      return;
    }

    try {
      console.log('Initializing map...');

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        // map style light
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-73.935242, 40.730610], // NYC coordinates
        zoom: 10,
        maxZoom: 16,
        minZoom: 8
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl());

      console.log('Map instance created:', map.current);

      // Wait for map to load before adding markers
      map.current.on('load', () => {
        console.log('Map style loaded successfully');
        
        const currentMap = map.current;
        if (!currentMap) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        console.log('Map loaded, adding markers for', crawls.length, 'crawls');

        // Create bounds object to fit all markers
        const bounds = new mapboxgl.LngLatBounds();

        // Add markers for each crawl
        crawls.forEach(crawl => {
          console.log('Processing crawl:', crawl);

          // Use improved borough detection with both location and address
          const borough = getBoroughFromLocation(crawl.location, crawl.address);
          const color = BOROUGH_COLORS[borough];

          // Create marker element
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundColor = color;
          el.style.width = '30px';
          el.style.height = '30px';
          el.style.borderRadius = '50%';
          el.style.border = '3px solid white';
          el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
          el.style.cursor = 'pointer';
          el.style.zIndex = '1';

          // Add click handler to marker element
          el.addEventListener('click', () => {
            handleMarkerClick(crawl.coordinates);
          });

          // Create and add marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat(crawl.coordinates)
            .setPopup(
              new mapboxgl.Popup({ 
                offset: 25,
                closeButton: true,
                closeOnClick: false,
                maxWidth: '300px'
              })
                .setHTML(`
                  <div style="min-width: 200px;">
                    <h3 style="font-weight: bold; color: ${color}; margin-bottom: 8px;">${crawl.name}</h3>
                    <p style="margin: 5px 0;"><strong>${crawl.location}</strong></p>
                    <p style="margin: 5px 0;">${crawl.address}</p>
                    <p style="margin: 5px 0; font-size: 0.9em;">${escapeHtml(stripHtml(crawl.description || ''))}</p>
                    <button 
                      onclick="document.dispatchEvent(new CustomEvent('flyTo', {detail: ${JSON.stringify(crawl.coordinates)}}))"
                      style="
                        background-color: ${color};
                        color: white;
                        padding: 6px 12px;
                        border: none;
                        border-radius: 4px;
                        margin-top: 8px;
                        cursor: pointer;
                        font-size: 0.9em;
                      "
                    >
                      Fly to location
                    </button>
                  </div>
                `)
            )
            .addTo(currentMap);

          // Add marker to refs array for cleanup
          markersRef.current.push(marker);

          // Extend bounds to include this point
          bounds.extend(crawl.coordinates);
        });

        // Add event listener for flyTo events from popups
        flyToHandlerRef.current = (e: CustomEvent) => {
          handleMarkerClick(e.detail);
        };
        document.addEventListener('flyTo', flyToHandlerRef.current as EventListener);

        // Fit map to bounds with padding
        currentMap.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 12
        });
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map');
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up map...');
      if (flyToHandlerRef.current) {
        document.removeEventListener('flyTo', flyToHandlerRef.current as EventListener);
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [crawls]);

  if (mapError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
        <p className="text-red-800 dark:text-red-200">{mapError}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 bg-gray-100" 
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-10">
        <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Boroughs</h3>
        {Object.entries(BOROUGH_COLORS).map(([borough, color]) => (
          <div key={borough} className="flex items-center gap-2 mb-1">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{borough}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 