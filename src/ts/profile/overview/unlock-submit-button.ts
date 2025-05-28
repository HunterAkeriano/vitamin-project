import { classManipulator, getElement, getElements } from '../../composables/use-call-dom.ts';

export function unlockSubmit() {
  const form = document.getElementById('overview-form') as HTMLFormElement;

  const inputs = form.querySelectorAll('input');
  const submitButton = getElement('.overview-form__submit-btn');
  const customDropdown = getElement('#overview-state');
  const dropdownItem = getElements('.dropdown__item');

  if (!(submitButton instanceof HTMLButtonElement)) return;
  if (!(customDropdown instanceof HTMLInputElement)) return;

  const startValue = customDropdown.value;

  if (dropdownItem.length === 0) return;

  dropdownItem.forEach((item) => {
    item.addEventListener('click', () => {
      if (item.innerText !== startValue) {
        classManipulator(submitButton, 'remove', 'overview-form__submit-btn_disabled');
        submitButton.disabled = false;
      }
    });
  });

  customDropdown.addEventListener('blur', () => {
    classManipulator(submitButton, 'remove', 'overview-form__submit-btn_disabled');
    submitButton.disabled = false;
  });

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      classManipulator(submitButton, 'remove', 'overview-form__submit-btn_disabled');
      submitButton.disabled = false;
    });
  });
}
