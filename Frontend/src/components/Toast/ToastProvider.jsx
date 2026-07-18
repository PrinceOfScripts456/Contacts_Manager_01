import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

// Messages longer than this read awkwardly as a single-line pill on
// mobile, so they get wrapped as a rounded box instead of forcing a pill
// shape to break awkwardly. This is purely a layout decision — it's
// separate from how long the toast stays visible (see DEFAULT_DURATION
// and the optional `duration` argument to showToast).
const LONG_MESSAGE_THRESHOLD = 46;
const DEFAULT_DURATION = 2700;
const WRAP_TEXT_DURATION = 4500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  // `duration` is optional — pass it explicitly for toasts carrying
  // information worth reading longer (e.g. import/export counts), even
  // if the message itself is short. Falls back to a length-based default
  // otherwise, so a random long message doesn't vanish before it wraps.
  //
  // Returns a function that dismisses this specific toast early — handy
  // for a "Preparing…" toast that should disappear as soon as the real
  // result is ready, rather than sitting on screen for its full duration.
  const showToast = useCallback((message, duration) => {
    const id = ++idCounter;
    const isLong = message.length > LONG_MESSAGE_THRESHOLD;
    const finalDuration = duration ?? (isLong ? WRAP_TEXT_DURATION : DEFAULT_DURATION);
    setToasts((prev) => [...prev, { id, message, isLong, duration: finalDuration }]);
    timers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timers.current[id];
    }, finalDuration);
    return () => dismissToast(id);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div
            className={`toast${t.isLong ? ' toast-wrap-text' : ''}`}
            key={t.id}
            style={{ '--toast-delay': `${(t.duration - 500) / 1000}s` }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
