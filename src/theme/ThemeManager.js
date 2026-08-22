/**
 * ThemeManager
 * ------------
 * Applies the chosen theme to the document root. 'system' listens to
 * the OS-level prefers-color-scheme media query so the popup follows
 * the user's Chrome/OS setting automatically.
 */
export class ThemeManager {
  constructor(rootEl = document.documentElement) {
    this._root = rootEl;
    this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  }

  /** @param {'system'|'light'|'dark'} mode */
  apply(mode) {
    const resolved = mode === 'system'
      ? (this._mediaQuery.matches ? 'dark' : 'light')
      : mode;
    this._root.setAttribute('data-theme', resolved);
  }

  /** Re-apply automatically when OS theme changes, if mode is 'system'. */
  watchSystemChanges(getCurrentMode) {
    this._mediaQuery.addEventListener('change', () => {
      if (getCurrentMode() === 'system') this.apply('system');
    });
  }
}
