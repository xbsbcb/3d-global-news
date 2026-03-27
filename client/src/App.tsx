import { useCallback } from 'react';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Globe from './components/Globe/Globe';
import NewsPopup from './components/Globe/NewsPopup';
import Timeline from './components/Timeline/Timeline';
import { useNewsStore } from './stores/newsStore';
import { useNews, useCategories } from './hooks/useNews';

function App() {
  const { selectedNews, setSelectedNews, isLoading } = useNewsStore();

  // Fetch news data
  const { data: newsResponse } = useNews({ limit: 100 });

  // Fetch categories
  const { data: categoriesResponse } = useCategories();

  // Handle marker click
  const handleMarkerClick = useCallback(
    (news: any) => {
      setSelectedNews(news);
    },
    [setSelectedNews]
  );

  // Handle popup close
  const handleClosePopup = useCallback(() => {
    setSelectedNews(null);
  }, [setSelectedNews]);

  return (
    <div className="flex flex-col h-screen bg-space-900 overflow-hidden">
      {/* Header */}
      <Header categories={categoriesResponse?.data || []} />

      {/* Main content */}
      <main className="flex-1 relative flex flex-col min-h-0">
        {/* Globe container */}
        <div className="flex-1 relative">
          <Globe onMarkerClick={handleMarkerClick} />

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-space-900/50 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
                <span className="text-neon-blue">Loading news...</span>
              </div>
            </div>
          )}

          {/* News count indicator */}
          <div className="absolute top-4 left-4 bg-space-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-space-700">
            <span className="text-sm text-gray-400">
              {newsResponse?.data?.pagination?.total || 0} news items on globe
            </span>
          </div>
        </div>

        {/* Timeline */}
        <Timeline />

        {/* News popup */}
        {selectedNews && (
          <NewsPopup news={selectedNews} onClose={handleClosePopup} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
