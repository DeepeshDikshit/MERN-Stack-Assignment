import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/" className="not-found-link">
          Go back to home
        </Link>
      </div>
    </div>
  );
}
