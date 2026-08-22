import { StorageAdapterFactory } from '../storage/StorageAdapterFactory.js';
import { StorageMigrator } from '../storage/StorageMigrator.js';

/**
 * SettingsController
 * -------------------
 * Owns the settings object and everything that changes it: theme,
 * list density, confirm-before-delete, and the sync/local storage
 * mode (including migrating existing answers when it's toggled).
 */
export class SettingsController {
  constructor({ settingsRepo, settingsPanel, theme, answerController }) {
    this._repo = settingsRepo;
    this._panel = settingsPanel;
    this._theme = theme;
    this._answers = answerController;
    this.settings = null;
  }

  async load() {
    this.settings = await this._repo.get();
    return this.settings;
  }

  bind() {
    this._panel.bind({
      onThemeChange: (theme) => this._patch({ theme }, () => this._theme.apply(theme)),
      onDensityChange: (listDensity) => this._patch({ listDensity }, () => this._answers.refresh()),
      onConfirmDeleteToggle: () => this._patch({ confirmBeforeDelete: !this.settings.confirmBeforeDelete }),
      onCloseOnCopyToggle: () => this._patch({ closeOnCopy: !this.settings.closeOnCopy }),
      onStorageModeToggle: () => this._toggleStorageMode(),
      onClearAll: () => this._answers.clearAll(),
    });
  }

  get() {
    return this.settings;
  }

  async _patch(partial, after) {
    this.settings = await this._repo.update(partial);
    this._panel.render(this.settings);
    if (after) after();
  }

  async _toggleStorageMode() {
    const nextMode = this.settings.storageMode === 'sync' ? 'local' : 'sync';
    const source = StorageAdapterFactory.create(this.settings.storageMode);
    const destination = StorageAdapterFactory.create(nextMode);

    await StorageMigrator.migrate(source, destination);
    this._answers.setAdapter(destination);
    await this._patch({ storageMode: nextMode });
    await this._answers.refresh();
  }
}
