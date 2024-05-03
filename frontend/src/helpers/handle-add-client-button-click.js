import { MODALS } from '@/constants/modals.js';

export function handleAddClientButtonClick(modals) {
  document.getElementById('add-client-button').addEventListener('click', () => {
    modals[MODALS.TEMPLATES.NEW_CLIENT].showModal();
  });
}
