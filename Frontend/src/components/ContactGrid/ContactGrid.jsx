import CardView from './CardView.jsx';
import CompactView from './CompactView.jsx';
import FullView from './FullView.jsx';
import EmptyState from './EmptyState.jsx';

export default function ContactGrid({ contacts, view, query, selectedId, onOpen, onEdit, onDelete }) {
  if (contacts.length === 0) {
    return <EmptyState hasQuery={!!query} query={query} />;
  }

  if (view === 'cards') {
    return <CardView contacts={contacts} selectedId={selectedId} onOpen={onOpen} onEdit={onEdit} />;
  }
  if (view === 'compact') {
    return <CompactView contacts={contacts} selectedId={selectedId} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} />;
  }
  return <FullView contacts={contacts} selectedId={selectedId} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} />;
}
