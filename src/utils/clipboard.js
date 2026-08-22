/**
 * Copy text to the clipboard using the async Clipboard API.
 * Works inside the extension popup without any extra permission
 * because it runs on direct user interaction (a click).
 * @param {string} text
 * @returns {Promise<boolean>} true if copy succeeded
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('QuickCopy: clipboard write failed', err);
    return false;
  }
}
