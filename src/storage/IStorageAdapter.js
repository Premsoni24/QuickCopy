/**
 * IStorageAdapter
 * ----------------
 * Abstract contract for any key-value storage backend.
 * Concrete adapters (SyncStorageAdapter, LocalStorageAdapter) must
 * implement every method here. This lets the rest of the app depend
 * only on this interface (Dependency Inversion Principle) instead of
 * a specific chrome.storage area.
 *
 * All methods are async and resolve/reject like chrome.storage promises.
 */
export class IStorageAdapter {
  /** @returns {Promise<Object<string, any>>} entire stored object */
  async getAll() {
    throw new Error('getAll() not implemented');
  }

  /** @param {Object<string, any>} entries */
  async setMany(entries) {
    throw new Error('setMany() not implemented');
  }

  /** @param {string} key */
  async remove(key) {
    throw new Error('remove() not implemented');
  }

  async clear() {
    throw new Error('clear() not implemented');
  }

  /** @returns {string} human-readable adapter name, e.g. "sync" | "local" */
  get name() {
    throw new Error('name getter not implemented');
  }
}
