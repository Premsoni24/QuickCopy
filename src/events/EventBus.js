/**
 * EventBus
 * --------
 * Minimal publish/subscribe implementation (Observer pattern). Lets
 * components communicate ("answers:changed", "toast:show", etc.)
 * without holding direct references to each other, keeping the UI
 * layer loosely coupled and easy to extend.
 */
export class EventBus {
  constructor() {
    this._listeners = new Map();
  }

  /** @param {string} event @param {Function} handler */
  on(event, handler) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  /** @param {string} event @param {Function} handler */
  off(event, handler) {
    this._listeners.get(event)?.delete(handler);
  }

  /** @param {string} event @param {*} [payload] */
  emit(event, payload) {
    this._listeners.get(event)?.forEach((handler) => handler(payload));
  }
}

/** Shared singleton so every module talks on the same bus. */
export const eventBus = new EventBus();
