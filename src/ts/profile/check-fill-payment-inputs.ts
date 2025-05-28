import { classManipulator, getElement, getElements } from '../composables/use-call-dom.ts';

export function checkFillPaymentInputs() {
  const form = getElement<HTMLFormElement>('#payment-methods-form');
  const submitButton = getElement('#payment-submit-btn');

  if (!(form instanceof HTMLFormElement)) return;
  const inputs = getElements('.card-input', form);

  function checkFormValidity(): void {
    const allFilled = Array.from(inputs).every((input) => input.value.trim() !== '');
    if (!(submitButton instanceof HTMLButtonElement)) return;
    if (allFilled) {
      submitButton.disabled = false;
      classManipulator(submitButton, 'remove', 'cards__submit_disabled');
    } else {
      submitButton.disabled = true;
      classManipulator(submitButton, 'add', 'cards__submit_disabled');
    }
  }

  inputs.forEach((input) => {
    input.addEventListener('input', checkFormValidity);
  });
}
