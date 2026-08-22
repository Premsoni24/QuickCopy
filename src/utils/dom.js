/**
 * dom.js — tiny reusable DOM helpers used across all components.
 * Kept dependency-free on purpose (no framework) to stay lightweight.
 */

/** @param {string} selector @param {ParentNode} [root] */
export function qs(selector, root = document) {
  return root.querySelector(selector);
}

/** @param {string} selector @param {ParentNode} [root] */
export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

/**
 * Create an element with attributes/children in one call.
 * @param {string} tag
 * @param {Object} [attrs]
 * @param {Array<Node|string>} [children]
 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') node.className = value;
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      node.setAttribute(key, value);
    }
  }
  children.forEach((child) => {
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

/** Remove all children of a node. */
export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}
