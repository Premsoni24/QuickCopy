import { el } from '../utils/dom.js';

function toggleGroup(dataAttr, options) {
  const buttons = options.map(([value, label]) =>
    el('button', { [`data-${dataAttr}-option`]: value }, [label])
  );
  return el('div', { class: 'toggle-group' }, buttons);
}

function row(labelNode, controlNode, descText) {
  const labelWrap = descText
    ? el('div', {}, [labelNode, el('div', { class: 'srt-desc' }, [descText])])
    : labelNode;
  return el('div', { class: 'settings-row' }, [labelWrap, controlNode]);
}

function card(rows) {
  return el('div', { class: 'settings-card' }, rows);
}

function section(title, cardNode) {
  return el('div', { class: 'settings-section' }, [
    el('div', { class: 'settings-section-title' }, [title]),
    cardNode,
  ]);
}

/** Builds the full settings body DOM tree. */
export function buildSettingsTemplate() {
  const appearance = section('Appearance', card([
    row(el('div', { class: 'srt-label' }, ['Theme']), toggleGroup('theme', [
      ['system', 'System'], ['light', 'Light'], ['dark', 'Dark'],
    ])),
    row(el('div', { class: 'srt-label' }, ['List preview']), toggleGroup('density', [
      ['preview', 'Show value'], ['compact', 'Key only'],
    ])),
  ]));

  const data = section('Data', card([
    row(el('div', { class: 'srt-label' }, ['Sync across devices']),
      el('div', { class: 'switch', id: 'syncModeSwitch' }),
      'Off stores answers on this device only'),
    row(el('div', { class: 'srt-label' }, ['Confirm before delete']),
      el('div', { class: 'switch', id: 'confirmDeleteSwitch' }),
      'Ask before removing a saved answer'),
    row(el('div', { class: 'srt-label' }, ['Clear all data']),
      el('span', { class: 'danger-text-btn', id: 'clearAllBtn' }, ['Clear all'])),
  ]));

  const behavior = section('Behavior', card([
    row(el('div', { class: 'srt-label' }, ['Close popup on copy']),
      el('div', { class: 'switch', id: 'closeOnCopySwitch' }),
      'Auto-close instead of showing a toast'),
  ]));

  const footer = el('div', { class: 'settings-footer-brand' }, ['QuickCopy v1.0.0']);
  return [appearance, behavior, data, footer];
}
