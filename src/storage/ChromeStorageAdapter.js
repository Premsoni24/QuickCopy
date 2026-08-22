import { IStorageAdapter } from './IStorageAdapter.js';

/**
 * ChromeStorageAdapter
 * --------------------
 * Concrete base class that wraps a specific chrome.storage.<area>.
 * SyncStorageAdapter and LocalStorageAdapter both extend this and only
 * differ in which `chrome.storage.*` area they point to (Open/Closed:
 * new backends can be added by extending this, without editing it).
 */
export class ChromeStorageAdapter extends IStorageAdapter {
  /**
   * @param {chrome.storage.StorageArea} area
   * @param {string} areaName
   */
  constructor(area, areaName) {
    super();
    this._area = area;
    this._areaName = areaName;
  }

  get name() {
    return this._areaName;
  }

  async getAll() {
    return new Promise((resolve, reject) => {
      this._area.get(null, (items) => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve(items || {});
      });
    });
  }

  async setMany(entries) {
    return new Promise((resolve, reject) => {
      this._area.set(entries, () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve();
      });
    });
  }

  async remove(key) {
    return new Promise((resolve, reject) => {
      this._area.remove(key, () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve();
      });
    });
  }

  async clear() {
    return new Promise((resolve, reject) => {
      this._area.clear(() => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve();
      });
    });
  }
}
