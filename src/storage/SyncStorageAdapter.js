import { ChromeStorageAdapter } from './ChromeStorageAdapter.js';

/**
 * Stores data in chrome.storage.sync — synced across the user's signed-in
 * Chrome devices. Limits: ~100KB total, 8KB per item, 512 items.
 */
export class SyncStorageAdapter extends ChromeStorageAdapter {
  constructor() {
    super(chrome.storage.sync, 'sync');
  }
}
