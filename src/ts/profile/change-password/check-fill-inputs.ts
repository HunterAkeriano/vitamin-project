import { classManipulator, getElement, getElements } from '../../composables/use-call-dom.ts';

export function checkFillInputs() {
  const form = getElement<HTMLFormElement>('#change-password');
  if (!(form instanceof HTMLFormElement)) return;
  const submitButton = getElement<HTMLButtonElement>('.change-password__submit-btn', form);
  const inputs = getElements('.field__input', form);

  function checkFormValidity(): void {
    const allFilled = Array.from(inputs).every((input) => input.value.trim() !== '');
    if (!(submitButton instanceof HTMLButtonElement) && !submitButton) return;
    if (allFilled) {
      submitButton.disabled = false;
      classManipulator(submitButton, 'remove', 'change-password__submit-btn_disabled');
    } else {
      submitButton.disabled = true;
      classManipulator(submitButton, 'add', 'change-password__submit-btn_disabled');
    }
  }

  inputs.forEach((input) => {
    input.addEventListener('input', checkFormValidity);
  });
}
