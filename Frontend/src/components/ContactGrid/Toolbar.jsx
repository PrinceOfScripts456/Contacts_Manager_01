import './Toolbar.css';

export default function Toolbar({
  shownCount, matchCount, totalOnServer,
  serverPage, serverTotalPages,
  searching, sort, onSortChange,
}) {
  // The backend may hold more matches than we've actually loaded into
  // this batch (its own `limit` query param caps that) — isPaginated
  // below is what decides whether to phrase the stat as "shown of match"
  // vs a plain contact count.
  const isPaginated = matchCount > shownCount;

  return (
    <div className="grid-toolbar">
      <div className="toolbar-main-row">
        <div className="contact-stat">
          <span>{shownCount}</span>
          {isPaginated ? (
            <> of <span>{matchCount}</span> match{matchCount !== 1 ? 'es' : ''}</>
          ) : (
            <> contact{shownCount !== 1 ? 's' : ''}</>
          )}
        </div>
        {searching && <span className="searching-indicator">Searching…</span>}
        <div className="toolbar-spacer"></div>
        <select className="sort-select" value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="az">Name A→Z</option>
          <option value="za">Name Z→A</option>
          <option value="company">Company</option>
          <option value="recent">Recently updated</option>
        </select>
      </div>
      {/* Reports which SERVER batch is currently loaded (distinct from the
          shownCount/matchCount stat above, which is about on-screen
          pagination over that one batch). Only shown when there's more
          than one server batch at all — a single-batch result set doesn't
          need this. The next/previous batch controls themselves live
          below the on-screen 1,2,3…N pager (see Pagination.jsx). */}
      {serverTotalPages > 1 && (
        <div className="capped-notice">
          Server batch {serverPage} of {serverTotalPages} — {matchCount.toLocaleString()} of {totalOnServer.toLocaleString()} total matches loaded
        </div>
      )}
    </div>
  );
}
