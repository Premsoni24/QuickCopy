# QuickCopy

A Chrome extension that stores short key/value answers (for job
applications) and copies a value to your clipboard with one click.

## Load it in Chrome (unpacked, for development)

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this `quickcopy` folder
5. Pin the QuickCopy icon from the extensions toolbar menu

No build step — it's plain ES modules, loaded straight by the popup.

## Architecture

```
manifest.json          MV3 manifest
popup/popup.html        Popup markup shell
popup/styles/           tokens.css (theme vars) / layout.css / components.css
src/app.js               Composition root — wires everything, no logic
src/controllers/         NavController, AnswerController, SettingsController
src/components/          List, ListItem, AddPanel, SettingsPanel, Toast,
                          ConfirmModal, Loader — all reusable, stateless-ish
src/repository/          AnswerRepository (CRUD + validation),
                          SettingsRepository (preferences)
src/storage/              IStorageAdapter (interface) + SyncStorageAdapter /
                          LocalStorageAdapter (Strategy pattern) +
                          StorageAdapterFactory + StorageMigrator
src/theme/ThemeManager.js Applies light/dark/system theme
src/utils/                dom, clipboard, validators, debounce, id
```

### Design principles applied

- **Single Responsibility** — each class does one thing (e.g. `AnswerRepository`
  only knows CRUD + validation, never how storage works).
- **Open/Closed** — a new storage backend is added by writing a new adapter
  class and one line in `StorageAdapterFactory`; nothing else changes.
- **Liskov Substitution** — `SyncStorageAdapter` and `LocalStorageAdapter`
  are fully interchangeable wherever `IStorageAdapter` is expected.
- **Interface Segregation** — `IStorageAdapter` only exposes the four
  methods storage consumers actually need.
- **Dependency Inversion** — `AnswerRepository` and the app depend on the
  `IStorageAdapter` abstraction, never on `chrome.storage` directly.

Every file is kept under 100 lines by design — logic is split into small,
single-purpose modules rather than large files.

### Data & validation rules

- Keys and values must both be **unique** (case-insensitive, trimmed).
  Save is blocked with an inline error if either collides.
- Delete asks for confirmation by default (toggle in Settings).
- Switching **Sync across devices** on/off in Settings migrates existing
  answers to the new storage area automatically — nothing is lost.

## Publishing to the Chrome Web Store (when ready)

1. Zip the contents of this folder (not the folder itself) — or the whole
   folder works too, Chrome accepts either at upload time.
2. Create a one-time **Chrome Web Store developer account** ($5 fee) at
   https://chrome.google.com/webstore/devconsole
3. Click **New item**, upload the zip.
4. Fill in: description, at least one 1280×800 (or 640×400) screenshot of
   the popup, and the small promo tile if you want featured placement.
5. Submit for review. Google's review typically takes a few days to ~2
   weeks for a first submission; expect them to check permissions match
   actual usage (this extension only requests `storage`, which is easy
   to justify).
