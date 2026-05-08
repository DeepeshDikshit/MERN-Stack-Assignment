import { StoryCard } from './StoryCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';
import './StoryList.css';

export const StoryList = ({ stories, loading, error, onBookmarkChange }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="empty-state">
        <p>No stories found. Try refreshing or check back later.</p>
      </div>
    );
  }

  return (
    <div className="story-list">
      {stories.map((story) => (
        <StoryCard
          key={story._id}
          story={story}
          onBookmarkChange={onBookmarkChange}
        />
      ))}
    </div>
  );
};
