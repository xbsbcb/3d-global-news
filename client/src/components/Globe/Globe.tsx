import { useRef, useEffect } from 'react';
import { useNewsStore } from '@/stores/newsStore';
import type { NewsItem } from '@/types/news';

interface GlobeProps {
  onMarkerClick?: (news: NewsItem) => void;
}

export default function Globe({ onMarkerClick }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<any>(null);
  const { news } = useNewsStore();

  useEffect(() => {
    if (!containerRef.current || globeInstanceRef.current) return;

    // Dynamically import Globe.gl
    import('globe.gl').then((mod) => {
      // Globe.gl exports a constructor
      const GlobeConstructor = mod.default;
      const globe = new GlobeConstructor(containerRef.current!);

      globeInstanceRef.current = globe
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .lineHoverPrecision(0)
        .onGlobeReady(() => {
          console.log('Globe is ready');
        });
    });

    return () => {
      globeInstanceRef.current = null;
    };
  }, []);

  // Update markers when news changes
  useEffect(() => {
    if (!globeInstanceRef.current || !news.length) return;

    const markers = news
      .filter((n) => n.latitude != null && n.longitude != null)
      .map((n) => ({
        lat: n.latitude,
        lng: n.longitude,
        name: n.title,
        size: 0.5,
        color: n.category?.color || '#00d4ff',
        news: n,
      }));

    globeInstanceRef.current
      .pointsData(markers)
      .pointLat('lat')
      .pointLng('lng')
      .pointName('name')
      .pointColor('color')
      .pointAltitude(0.01)
      .pointRadius('size')
      .onPointClick((point: any) => {
        onMarkerClick?.(point.news);
      });
  }, [news, onMarkerClick]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full globe-container"
    />
  );
}
