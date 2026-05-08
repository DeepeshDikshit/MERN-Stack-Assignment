import { useState, useEffect } from 'react';
import { storyService } from '../services/storyService';
import { StoryList } from '../components/StoryList';
import { Pagination } from '../components/Pagination';
import './HomePage.css';

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const limit = 10;

  useEffect(() => {
    fetchStories(currentPage);
  }, [currentPage]);

  const fetchStories = async (page) => {
    setLoading(true);
    setError('');
    try {
      const response = await storyService.getStories(page, limit);
      setStories(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await storyService.triggerScrape();
      await fetchStories(1);
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh stories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Hacker News Stories</h1>
        <button onClick={handleRefresh} className="refresh-btn" disabled={loading}>
          {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
      <StoryList
        stories={stories}
        loading={loading}
        error={error}
        onBookmarkChange={() => fetchStories(currentPage)}
      />
      {!loading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
