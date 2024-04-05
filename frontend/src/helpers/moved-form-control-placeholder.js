export function movedFormControlPlaceholder(control) {
  control.addEventListener('input', (event) => {
    const placeholder = event.target.nextElementSibling;
    if (event.target.value.trim() !== '') {
      placeholder.classList.add('form-control__placeholder_filled');
    } else {
      placeholder.classList.remove('form-control__placeholder_filled');
    }
  });
}
