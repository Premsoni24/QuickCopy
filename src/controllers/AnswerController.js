import { qs } from '../utils/dom.js';
import { debounce } from '../utils/debounce.js';
import { copyToClipboard } from '../utils/clipboard.js';

/**
 * AnswerController
 * ----------------
 * Coordinates the answer repository with the List, AddPanel, Toast,
 * ConfirmModal and Loader components. Reads `getSettings()` lazily
 * so it always reflects the latest density/confirm-delete preference
 * without needing its own settings copy.
 */
export class AnswerController {
  constructor({ answerRepo, list, addPanel, confirmModal, toast, loader, getSettings }) {
    this._repo = answerRepo;
    this._list = list;
    this._addPanel = addPanel;
    this._confirmModal = confirmModal;
    this._toast = toast;
    this._loader = loader;
    this._getSettings = getSettings;
  }

  /** @param {import('../storage/IStorageAdapter.js').IStorageAdapter} adapter */
  setAdapter(adapter) {
    this._repo.setAdapter(adapter);
  }

  bind() {
    qs('#searchInput').addEventListener('input', debounce(() => this.refresh(), 100));
    this._addPanel.bindSave(async (key, value) => {
      const result = await this._loader.wrap(() => this._repo.add(key, value));
      if (result.success) await this.refresh();
      return result;
    });
  }

  async refresh() {
    const answers = await this._loader.wrap(() => this._repo.getAll());
    const filterText = qs('#searchInput').value;
    const density = this._getSettings().listDensity;
    this._list.render(answers, filterText, density, {
      onCopy: (answer) => this._handleCopy(answer),
      onDelete: (answer) => this._handleDelete(answer),
    });
  }

  async _handleCopy(answer) {
    const ok = await copyToClipboard(answer.value);
    if (!ok) {
      this._toast.show('Copy failed — try again');
      return;
    }
    if (this._getSettings().closeOnCopy) {
      window.close();
      return;
    }
    this._toast.show('Copied to clipboard');
  }

  async _handleDelete(answer) {
    if (this._getSettings().confirmBeforeDelete) {
      const confirmed = await this._confirmModal.open('Delete answer?', `Delete "${answer.key}"? This can't be undone.`);
      if (!confirmed) return;
    }
    await this._loader.wrap(() => this._repo.remove(answer.id));
    await this.refresh();
  }

  async clearAll() {
    const confirmed = await this._confirmModal.open('Clear all data?', 'This removes every saved answer. This cannot be undone.');
    if (!confirmed) return;
    const answers = await this._repo.getAll();
    await this._loader.wrap(() => Promise.all(answers.map((a) => this._repo.remove(a.id))));
    await this.refresh();
  }
}
