declare module 'globe.gl' {
  interface GlobeInstance {
    (element: HTMLElement): GlobeInstance;
    globeImageUrl(url: string): GlobeInstance;
    bumpImageUrl(url: string): GlobeInstance;
    backgroundImageUrl(url: string): GlobeInstance;
    lineHoverPrecision(precision: number): GlobeInstance;
    onGlobeReady(callback: () => void): GlobeInstance;
    onZoom(callback: (pov: any) => void): GlobeInstance;
    onPointClick(callback: (point: any) => void): GlobeInstance;
    pointsData(data: any[]): GlobeInstance;
    pointLat(accessor: string): GlobeInstance;
    pointLng(accessor: string): GlobeInstance;
    pointName(accessor: string): GlobeInstance;
    pointColor(accessor: string): GlobeInstance;
    pointAltitude(accessor: number | string): GlobeInstance;
    pointRadius(accessor: number | string): GlobeInstance;
    scale(): number;
  }

  interface GlobeConstructor {
    new (element: HTMLElement): GlobeInstance;
  }

  const Globe: GlobeConstructor;
  export default Globe;
}
