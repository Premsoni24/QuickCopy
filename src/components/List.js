import { qs, clear } from '../utils/dom.js';
import { renderListItem } from './ListItem.js';

/**
 * List
 * ----
 * Renders the alphabetized, filterable list of saved answers.
 * Receives plain data + handlers — it owns no state of its own,
 * making it easy to re-render on demand from the app controller.
 */
export class List {
  constructor(listSelector = '#extList', emptySelector = '#emptyState', countSelector = '#itemCount') {
    this._listEl = qs(listSelector);
    this._emptyEl = qs(emptySelector);
    this._countEl = qs(countSelector);
  }

  /**
   * @param {Array<{id:string,key:string,value:string}>} answers
   * @param {string} filterText
   * @param {'preview'|'compact'} density
   * @param {{onCopy:Function, onDelete:Function}} handlers
   */
  render(answers, filterText, density, hideSensitive, handlers) {
    const filtered = answers.filter((a) =>
      a.key.toLowerCase().includes(filterText.trim().toLowerCase())
    );

    clear(this._listEl);

    if (filtered.length === 0) {
      this._emptyEl.style.display = 'flex';
      this._listEl.style.display = 'none';
    } else {
      this._emptyEl.style.display = 'none';
      this._listEl.style.display = 'block';
      filtered.forEach((answer) => {
        this._listEl.appendChild(renderListItem(answer, density, hideSensitive, handlers));
      });
    }

    this._countEl.textContent = `${filtered.length} saved answer${filtered.length !== 1 ? 's' : ''}`;
  }
}
