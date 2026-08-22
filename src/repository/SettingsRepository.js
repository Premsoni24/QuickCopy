const SETTINGS_KEY = 'settings';

/** Defaults applied on first-ever run of the extension. */
export const DEFAULT_SETTINGS = {
  theme: 'system', // 'system' | 'light' | 'dark'
  listDensity: 'preview', // 'preview' | 'compact'
  storageMode: 'sync', // 'sync' | 'local'
  confirmBeforeDelete: true,
};

/**
 * SettingsRepository
 * -------------------
 * Persists user preferences. Settings are intentionally stored via
 * chrome.storage.local directly (not through the swappable adapter),
 * because preferences like "which storage mode to use" must survive
 * even while the mode itself is being switched.
 */
export class SettingsRepository {
  async get() {
    return new Promise((resolve) => {
      chrome.storage.local.get(SETTINGS_KEY, (result) => {
        resolve({ ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] || {}) });
      });
    });
  }

  /** @param {Partial<typeof DEFAULT_SETTINGS>} patch */
  async update(patch) {
    const current = await this.get();
    const next = { ...current, ...patch };
    return new Promise((resolve) => {
      chrome.storage.local.set({ [SETTINGS_KEY]: next }, () => resolve(next));
    });
  }
}
