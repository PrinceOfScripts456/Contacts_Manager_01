import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'cm-theme';

function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved === 'dark';
  return window.matchMedia('(prefers-color-scheme:dark)').matches;
}

// Matches --dur (.2s) plus the theme-icon-in keyframe duration (.35s) in
// Topbar.css, with a small buffer. Kept as a single source of truth here
// so the JS-driven delay and the CSS animation length can't silently
// drift apart.
const ICON_ANIM_MS = 380;

/**
 * Manages the dark/light theme, mirroring the original setTheme() function:
 * sets the `data-theme` attribute on <html> and persists the choice.
 *
 * The `data-theme` attribute itself is already set correctly on initial
 * load — a blocking inline script in index.html reads localStorage/
 * matchMedia and applies it pre-paint, so there's no light-then-dark flash
 * on first load.
 *
 * For a user-initiated TOGGLE (not initial load), theme switching is
 * deliberately sequenced in two steps rather than flipping everything at
 * once:
 *   1. `pendingDark` flips immediately — this only drives the toggle
 *      button's own icon (sun/moon swap + its rotate/fade animation), so
 *      the button gives instant feedback that the click registered.
 *   2. `dark` (and therefore `data-theme`, which every themed color across
 *      the whole page transitions off of) only flips after the icon's
 *      animation has finished playing.
 * Without this split, the button's rotate animation and the page-wide
 * color fade started at the same instant and visually fought each other.
 * Sequencing them means the button finishes its own motion first, then
 * the color fade plays cleanly on top of a settled UI.
 */
export function useTheme() {
  const [dark, setDark] = useState(getInitialTheme);
  const [pendingDark, setPendingDark] = useState(getInitialTheme);
  const timerRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const toggleTheme = useCallback(() => {
    setPendingDark((d) => {
      const next = !d;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setDark(next), ICON_ANIM_MS);
      return next;
    });
  }, []);

  // `dark` drives the actual page colors; `pendingDark` drives only the
  // toggle button's own icon so it can react the instant the user clicks.
  return { dark, pendingDark, toggleTheme };
}
