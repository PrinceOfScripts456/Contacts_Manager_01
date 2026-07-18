import './BlockingOverlay.css';

/**
 * Full-screen overlay shown while a long-running backend operation
 * (export or import) is in progress. The rest of the app is blurred and
 * made inert (unfocusable, unclickable) via the `app-shell-blocked` class
 * + `inert` attribute applied in ContactsPage — this component is just
 * the visible spinner + message sitting on top of that.
 */
export default function BlockingOverlay({ active, message }) {
  if (!active) return null;

  return (
    <div className="blocking-overlay" role="alert" aria-live="assertive">
      <div className="blocking-overlay-box">
        <div className="blocking-spinner"></div>
        <div className="blocking-overlay-text">{message}</div>
      </div>
    </div>
  );
}
