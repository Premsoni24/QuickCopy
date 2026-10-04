import { el } from '../utils/dom.js';

function initials(text) {
  return text.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

/**
 * Builds the DOM node for one answer row.
 * @param {{id:string,key:string,value:string}} answer
 * @param {'preview'|'compact'} density
 * @param {{onCopy:Function, onDelete:Function}} handlers
 */
export function renderListItem(answer, density,hideSensitive, { onCopy, onDelete }) {
  const bodyChildren = [el('div', { class: 'kv-key' }, [answer.key])];
  if (density === 'preview') {
  const previewValue = hideSensitive
    ? '••••••••'
    : answer.value;

  bodyChildren.push(
    el('div', { class: 'kv-value-preview' }, [previewValue])
  );
}

  const body = el('div', { class: 'kv-body', onClick: () => onCopy(answer) }, bodyChildren);
  const icon = el('div', { class: 'kv-icon', onClick: () => onCopy(answer) }, [initials(answer.key)]);
  const deleteBtn = el('div', { class: 'kv-delete', title: 'Delete', onClick: (e) => {
    e.stopPropagation();
    onDelete(answer);
  } }, ['✕']);

  return el('div', { class: 'kv-item' }, [icon, body, deleteBtn]);
}
