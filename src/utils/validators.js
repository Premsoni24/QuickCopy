/**
 * validators.js
 * -------------
 * Pure functions, no side effects, fully unit-testable in isolation.
 * Comparisons are trimmed + case-insensitive, so "Notice Period" and
 * "notice period" are treated as the same key or value.
 */

/** @param {string} value */
export function isBlank(value) {
  return !value || value.trim().length === 0;
}

/** @param {string} a @param {string} b */
export function isSameText(a, b) {
  return (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase();
}

/**
 * @param {string} candidateKey
 * @param {Array<{key: string}>} existingAnswers
 * @param {string} [excludeId] answer id to ignore (when editing)
 */
export function isDuplicateKey(candidateKey, existingAnswers, excludeId = null) {
  return existingAnswers.some(
    (a) => a.id !== excludeId && isSameText(a.key, candidateKey)
  );
}

/**
 * @param {string} candidateValue
 * @param {Array<{value: string}>} existingAnswers
 * @param {string} [excludeId]
 */
export function isDuplicateValue(candidateValue, existingAnswers, excludeId = null) {
  return existingAnswers.some(
    (a) => a.id !== excludeId && isSameText(a.value, candidateValue)
  );
}

/**
 * Validates a new/edited answer against the full answer list.
 * @returns {{valid: boolean, error: string|null}}
 */
export function validateAnswer(key, value, existingAnswers, excludeId = null) {
  if (isBlank(key)) return { valid: false, error: 'Key cannot be empty.' };
  if (isBlank(value)) return { valid: false, error: 'Value cannot be empty.' };
  if (isDuplicateKey(key, existingAnswers, excludeId)) {
    return { valid: false, error: 'That key already exists. Keys must be unique.' };
  }
  if (isDuplicateValue(value, existingAnswers, excludeId)) {
    return { valid: false, error: 'That value already exists. Values must be unique.' };
  }
  return { valid: true, error: null };
}
