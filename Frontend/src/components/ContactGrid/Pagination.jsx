import './Pagination.css';

/**
 * Builds a compact list of page numbers to display, e.g.:
 *  [1, 2, 3, 4, 5, '…', 20]  or  [1, '…', 8, 9, 10, '…', 20]
 * Always keeps the first and last page visible, plus a window around the
 * current page, collapsing long runs into a single '…' marker.
 */
function buildPageList(current, total) {
  const pages = [];
  const windowSize = 1; // pages shown on each side of current

  const add = (p) => pages.push(p);

  add(1);
  if (current - windowSize > 2) add('…');

  for (let p = Math.max(2, current - windowSize); p <= Math.min(total - 1, current + windowSize); p++) {
    add(p);
  }

  if (current + windowSize < total - 1) add('…');
  if (total > 1) add(total);

  return pages;
}

/**
 * Two independent, stacked controls:
 *  - The 1,2,3…N row: on-screen pagination over whatever ONE server batch
 *    is currently loaded (client-side, instant, no network request).
 *  - The "Previous/Next batch" row below it: asks the backend for a
 *    DIFFERENT batch entirely (see loadServerBatch in useContacts.js),
 *    replacing what's loaded rather than appending to it. Each button
 *    hides itself individually when there's nothing in that direction
 *    (no previous batch on batch 1, no next batch on the last one), so
 *    the row only ever shows what's actually usable.
 */
export default function Pagination({
  currentPage, totalPages, onPageChange,
  loadingMore = false,
  hasPrevBatch = false, hasNextBatch = false,
  onPrevBatch, onNextBatch,
}) {
  const showPageRow = totalPages > 1;
  const showBatchRow = hasPrevBatch || hasNextBatch || loadingMore;
  if (!showPageRow && !showBatchRow) return null;

  const pages = showPageRow ? buildPageList(currentPage, totalPages) : [];

  return (
    <div className="pagination-wrap">
      {showPageRow && (
        <nav className="pagination" aria-label="Pagination">
          <button
            className="page-btn page-nav"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            ‹
          </button>

          {pages.map((p, i) =>
            p === '…' ? (
              <span className="page-ellipsis" key={`e${i}`}>…</span>
            ) : (
              <button
                key={p}
                className={`page-btn${p === currentPage ? ' active' : ''}`}
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? 'page' : undefined}
              >
                {p}
              </button>
            )
          )}

          <button
            className="page-btn page-nav"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            ›
          </button>
        </nav>
      )}

      {showBatchRow && (
        <nav className="batch-nav" aria-label="Server batch navigation">
          {hasPrevBatch && (
            <button className="batch-btn" onClick={onPrevBatch} disabled={loadingMore}>
              ‹ Previous batch from server
            </button>
          )}
          {loadingMore && <span className="pagination-loading-more">Loading…</span>}
          {hasNextBatch && (
            <button className="batch-btn" onClick={onNextBatch} disabled={loadingMore}>
              Next batch from server ›
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
