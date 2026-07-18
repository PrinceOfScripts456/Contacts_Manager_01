import './ExportOverlay.css';

/**
 * Full-screen overlay shown while the backend is preparing an export
 * file. The rest of the app is blurred and made inert (unfocusable,
 * unclickable) via the `app-shell-blocked` class + `inert` attribute
 * applied in ContactsPage — this component is just the visible spinner
 * sitting on top of that.
 */
export default function ExportOverlay({ active }) {
  if (!active) return null;

  return (
    <div className="export-overlay" role="alert" aria-live="assertive">
      <div className="export-overlay-box">
        <div className="export-spinner"></div>
        <div className="export-overlay-text">Preparing your export…</div>
      </div>
    </div>
  );
}
