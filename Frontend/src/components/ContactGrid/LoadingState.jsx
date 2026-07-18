import './LoadingState.css';

/**
 * Skeleton placeholder shown while the initial contact list is loading.
 * Mimics the card grid's shape so the transition into real content
 * doesn't jump around, and gives clear feedback that something is
 * happening instead of an empty page for a few seconds.
 */
export default function LoadingState() {
  const skeletonCount = 12;

  return (
    <div className="grid-cards" aria-busy="true" aria-label="Loading contacts">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-banner">
            <div className="skeleton-av"></div>
          </div>
          <div className="skeleton-body">
            <div className="skeleton-line skeleton-line-name"></div>
            <div className="skeleton-line skeleton-line-role"></div>
            <div className="skeleton-line skeleton-line-info"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
