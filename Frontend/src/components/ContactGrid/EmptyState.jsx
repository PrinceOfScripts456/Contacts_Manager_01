import { XCircleIcon } from '../icons.jsx';

export default function EmptyState({ hasQuery, query }) {
  return (
    <div className="empty-page">
      <div className="empty-page-icon">
        <XCircleIcon />
      </div>
      <h2>{hasQuery ? 'No results' : 'No contacts yet'}</h2>
      <p>
        {hasQuery
          ? `Nothing matched "${query}". Try a different search.`
          : 'Add your first contact to get started.'}
      </p>
    </div>
  );
}
