/**
 * @description Обрабатывает перемещение placeholder.
 * @param {HTMLElement} control - контрол, для которого нужно переместить placeholder.
 */

export function movedFormControlPlaceholder(control) {
  let placeholder = control.nextElementSibling;

  function isValue(target, placeholder) {
    if (target.value.trim() !== '') {
      placeholder.classList.add('form-control__placeholder_filled');
    } else {
      placeholder.classList.remove('form-control__placeholder_filled');
    }
  }

  control.addEventListener('input', () => {
    isValue(control, placeholder);
  });
  isValue(control, placeholder);
}
