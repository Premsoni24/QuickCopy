/**
 * Generates a short, storage-key-safe unique id for a new answer.
 * Not cryptographically secure — doesn't need to be, it's just a
 * local record identifier.
 */
export function generateId() {
  return `ans_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
