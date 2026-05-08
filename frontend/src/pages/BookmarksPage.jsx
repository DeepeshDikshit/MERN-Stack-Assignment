import { useState, useEffect } from 'react';
import { storyService } from '../services/storyService';
import { StoryList } from '../components/StoryList';
import './BookmarksPage.css';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await storyService.getBookmarks();
      setBookmarks(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bookmarks-page">
      <h1>📚 Saved Bookmarks</h1>
      <StoryList
        stories={bookmarks}
        loading={loading}
        error={error}
        onBookmarkChange={fetchBookmarks}
      />
    </div>
  );
}
