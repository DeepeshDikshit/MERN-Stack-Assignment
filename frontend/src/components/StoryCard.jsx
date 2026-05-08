import { useState } from 'react';
import { storyService } from '../services/storyService';
import './StoryCard.css';

export const StoryCard = ({ story, onBookmarkChange }) => {
  const [isBookmarked, setIsBookmarked] = useState(story.isBookmarked || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBookmark = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isBookmarked) {
        await storyService.removeBookmark(story._id);
      } else {
        await storyService.addBookmark(story._id);
      }
      setIsBookmarked(!isBookmarked);
      onBookmarkChange?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="story-card">
      <div className="story-content">
        <h3 className="story-title">
          <a href={story.url} target="_blank" rel="noopener noreferrer">
            {story.title}
          </a>
        </h3>
        <div className="story-meta">
          <span className="story-points">⬆️ {story.points} points</span>
          <span className="story-author">by {story.author}</span>
          <span className="story-time">{formatTime(story.postedAt)}</span>
          <span className="story-comments">💬 {story.comments} comments</span>
        </div>
        {error && <div className="story-error">{error}</div>}
      </div>
      <button
        className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
        onClick={handleBookmark}
        disabled={loading}
        title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {loading ? '...' : isBookmarked ? '⭐' : '☆'}
      </button>
    </div>
  );
};
