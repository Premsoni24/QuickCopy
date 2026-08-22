import { SyncStorageAdapter } from './SyncStorageAdapter.js';
import { LocalStorageAdapter } from './LocalStorageAdapter.js';

/**
 * StorageAdapterFactory
 * ----------------------
 * Single place that knows how to build a storage adapter from a mode
 * string. Adding a new backend later (e.g. a remote API) means adding
 * one case here and one new adapter class — nothing else changes.
 */
export class StorageAdapterFactory {
  /**
   * @param {'sync'|'local'} mode
   * @returns {import('./IStorageAdapter.js').IStorageAdapter}
   */
  static create(mode) {
    switch (mode) {
      case 'local':
        return new LocalStorageAdapter();
      case 'sync':
      default:
        return new SyncStorageAdapter();
    }
  }
}
