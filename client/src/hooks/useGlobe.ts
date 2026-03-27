import { useEffect, useRef, useCallback } from 'react';
import { useNewsStore } from '@/stores/newsStore';
import type { NewsItem } from '@/types/news';

interface UseGlobeOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  onMarkerClick?: (news: NewsItem) => void;
}

export function useGlobe({ containerRef, onMarkerClick }: UseGlobeOptions) {
  const instanceRef = useRef<any>(null);
  const { news } = useNewsStore();

  const initGlobe = useCallback(async () => {
    if (!containerRef.current || instanceRef.current) return;

    const GlobeConstructor = (await import('globe.gl')).default;
    instanceRef.current = new GlobeConstructor(containerRef.current);
  }, [containerRef]);

  const updateMarkers = useCallback(() => {
    if (!instanceRef.current || !news.length) return;

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

    instanceRef.current
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

  useEffect(() => {
    initGlobe();
    return () => {
      instanceRef.current = null;
    };
  }, [initGlobe]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  return {
    globe: instanceRef.current,
  };
}
