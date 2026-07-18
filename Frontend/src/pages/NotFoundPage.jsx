import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-code">404</div>
      <h1 className="notfound-title">Page not found</h1>
      <p className="notfound-text">
        The page you're looking for doesn't exist, may have been moved,
        or the URL might be mistyped.
      </p>
      <button className="notfound-btn" onClick={() => navigate('/')}>
        ← Back to Contacts
      </button>
    </div>
  );
}
