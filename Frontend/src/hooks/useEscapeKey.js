import { useEffect } from 'react';

/**
 * Calls `onEscape` whenever the Escape key is pressed while this hook is
 * mounted. Mirrors the original's single global keydown listener that
 * closed the contact modal, confirm modal, and drawer all at once.
 */
export function useEscapeKey(onEscape) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onEscape();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape]);
}
