import { validateAnswer } from '../utils/validators.js';
import { generateId } from '../utils/id.js';

const PREFIX = 'answer::';

/**
 * AnswerRepository
 * ----------------
 * Owns all CRUD logic for saved answers. Depends only on the
 * IStorageAdapter interface (Dependency Inversion) — it never talks
 * to chrome.storage directly, so swapping/testing storage backends
 * doesn't touch this class (Single Responsibility: "manage answers",
 * not "know how storage works").
 */
export class AnswerRepository {
  /** @param {import('../storage/IStorageAdapter.js').IStorageAdapter} adapter */
  constructor(adapter) {
    this._adapter = adapter;
  }

  /** Swap the underlying adapter (used after a sync/local migration). */
  setAdapter(adapter) {
    this._adapter = adapter;
  }

  /** @returns {Promise<Array<{id:string,key:string,value:string}>>} */
  async getAll() {
    const raw = await this._adapter.getAll();
    return Object.entries(raw)
      .filter(([k]) => k.startsWith(PREFIX))
      .map(([, v]) => v)
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  /**
   * @param {string} key
   * @param {string} value
   * @returns {Promise<{success:boolean,error?:string,answer?:object}>}
   */
  async add(key, value,sensitive = false) {
    const existing = await this.getAll();
    const { valid, error } = validateAnswer(key, value, existing);
    if (!valid) return { success: false, error };

    const answer = { id: generateId(), key: key.trim(), value: value.trim(),sensitive: Boolean(sensitive) };
    await this._adapter.setMany({ [PREFIX + answer.id]: answer });
    return { success: true, answer };
  }

  /** @param {string} id */
  async remove(id) {
    await this._adapter.remove(PREFIX + id);
  }
}
