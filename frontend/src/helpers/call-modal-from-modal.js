import { MODALS } from '@/constants/modals.js';
import { convertTimeStringToMilliseconds } from '@/helpers/convert-time-string-to-milliseconds.js';

/**
 * Вызывает модальное окно из другого модального окна с задержкой.
 * @param {Object} props - Объект с параметрами вызова модального окна.
 * @param {Object} props.modals - Коллекция модальных окон.
 * @param {string} props.fromModalTemplate - Шаблон исходного модального окна.
 * @param {string} props.toModalTemplate - Шаблон целевого модального окна.
 * @param {any} props.client - Данные клиента для передачи в модальное окно.
 */
export function callModalFromModal(props) {
  const { modals, fromModalTemplate, toModalTemplate, client } = props;

  setTimeout(
    () => {
      const targetModal = modals[toModalTemplate];
      targetModal.showModal(client);

      if (toModalTemplate === MODALS.TEMPLATES.DELETE_CLIENT) {
        targetModal.modal.setAttribute(
          MODALS.ATTRS.IS_NEED_OPEN_EDIT_MODAL,
          'true',
        );
      }

      if (fromModalTemplate === MODALS.TEMPLATES.DELETE_CLIENT) {
        modals[fromModalTemplate].modal.removeAttribute(
          MODALS.ATTRS.IS_NEED_OPEN_EDIT_MODAL,
        );
      }
    },
    convertTimeStringToMilliseconds(
      window.getComputedStyle(props.modals[props.fromModalTemplate].modal)
        .animationDuration,
    ) + 10,
  );
}
