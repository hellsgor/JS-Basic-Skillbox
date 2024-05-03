import clientsApi from '@api/Clients-api.js';
import { MODALS } from '@/constants/modals.js';

export function openClientEditModalIfHashExists(modals) {
  if (window.location.hash) {
    clientsApi
      .getClient({ id: window.location.hash.substring(1) })
      .then((response) => {
        modals[MODALS.TEMPLATES.EDIT_CLIENT].showModal(response);
      });
  }
}
