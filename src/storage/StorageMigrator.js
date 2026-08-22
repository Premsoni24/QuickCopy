/**
 * StorageMigrator
 * ---------------
 * Copies all data from one storage adapter to another, then clears the
 * source. Used when the user flips "Sync across devices" in Settings,
 * so switching modes never silently loses their saved answers.
 */
export class StorageMigrator {
  /**
   * @param {import('./IStorageAdapter.js').IStorageAdapter} source
   * @param {import('./IStorageAdapter.js').IStorageAdapter} destination
   * @returns {Promise<number>} number of entries migrated
   */
  static async migrate(source, destination) {
    const data = await source.getAll();
    const keys = Object.keys(data);
    if (keys.length === 0) return 0;

    await destination.setMany(data);
    await source.clear();
    return keys.length;
  }
}
