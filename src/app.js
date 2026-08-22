import { StorageAdapterFactory } from './storage/StorageAdapterFactory.js';
import { AnswerRepository } from './repository/AnswerRepository.js';
import { SettingsRepository } from './repository/SettingsRepository.js';
import { ThemeManager } from './theme/ThemeManager.js';
import { List } from './components/List.js';
import { AddPanel } from './components/AddPanel.js';
import { SettingsPanel } from './components/SettingsPanel.js';
import { ConfirmModal } from './components/ConfirmModal.js';
import { Toast } from './components/Toast.js';
import { Loader } from './components/Loader.js';
import { NavController } from './controllers/NavController.js';
import { AnswerController } from './controllers/AnswerController.js';
import { SettingsController } from './controllers/SettingsController.js';

/**
 * Bootstrap
 * ---------
 * Wires all repositories, components, and controllers together, then
 * kicks off the initial render. Deliberately thin: no business logic
 * lives here, only composition (Dependency Injection root).
 */
async function bootstrap() {
  const settingsRepo = new SettingsRepository();
  const settings = await settingsRepo.get();

  const theme = new ThemeManager();
  const addPanel = new AddPanel();
  const settingsPanel = new SettingsPanel();
  const answerRepo = new AnswerRepository(StorageAdapterFactory.create(settings.storageMode));

  const answerController = new AnswerController({
    answerRepo,
    list: new List(),
    addPanel,
    confirmModal: new ConfirmModal(),
    toast: new Toast(),
    loader: new Loader(),
    getSettings: () => settingsController.get(),
  });

  const settingsController = new SettingsController({
    settingsRepo,
    settingsPanel,
    theme,
    answerController,
  });
  settingsController.settings = settings;

  theme.apply(settings.theme);
  theme.watchSystemChanges(() => settingsController.get().theme);
  settingsPanel.render(settings);

  new NavController(addPanel).bind();
  answerController.bind();
  settingsController.bind();
  await answerController.refresh();
}

document.addEventListener('DOMContentLoaded', bootstrap);
