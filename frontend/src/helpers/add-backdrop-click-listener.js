import { MODALS } from '@/constants/modals.js';

export function addBackdropClickListener(modals) {
  document.getElementById('backdrop').addEventListener('click', () => {
    Object.keys(modals).forEach((modalName) => {
      if (
        modals[modalName].modal.classList.contains(
          `${MODALS.CLASS_NAMES.MODAL_CLASS_NAME}${MODALS.MODIFIERS.HIDDEN}`,
        )
      ) {
        return;
      }
      modals[modalName].closeModal();
    });
  });
}
