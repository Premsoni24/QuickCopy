import { ChromeStorageAdapter } from './ChromeStorageAdapter.js';

/**
 * Stores data in chrome.storage.local — this device only, much higher
 * limit (~10MB), never leaves the machine.
 */
export class LocalStorageAdapter extends ChromeStorageAdapter {
  constructor() {
    super(chrome.storage.local, 'local');
  }
}
