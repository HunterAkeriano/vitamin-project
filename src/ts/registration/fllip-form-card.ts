import { classManipulator, getElement, getElements } from '../composables/use-call-dom.ts';

export function flipFormCard() {
  const card = getElement<HTMLDivElement>('#auth-card');
  const buttonRegular = getElement<HTMLButtonElement>('#regular-reg');
  const buttonWholesale = getElement<HTMLButtonElement>('#wholesale-reg');
  const errorContainer = getElements<HTMLSpanElement>('.registration-form__error-message');
  const registrationContainer = getElement<HTMLDivElement>('.registration__container');

  if (card && buttonRegular && buttonWholesale) {
    buttonRegular.addEventListener('click', () => {
      classManipulator(buttonWholesale, 'remove', 'registration__nav-btn_active');
      classManipulator(buttonRegular, 'add', 'registration__nav-btn_active');
      classManipulator(card, 'add', 'flipped');

      const regularForm = getElement<HTMLFormElement>('#regular-registration');
      if (regularForm) {
        regularForm.reset();
      }

      errorContainer.forEach((item) => {
        item.innerText = '';
      });

      const errorLabel = getElements<HTMLElement>('.just-validate-error-label');
      errorLabel.forEach((label) => {
        label.remove();
      });

      if (registrationContainer) {
        registrationContainer.style.height = '890px';
      }
    });

    buttonWholesale.addEventListener('click', () => {
      classManipulator(buttonWholesale, 'add', 'registration__nav-btn_active');
      classManipulator(buttonRegular, 'remove', 'registration__nav-btn_active');
      classManipulator(card, 'remove', 'flipped');

      const whoForm = getElement<HTMLFormElement>('#wholesale-registration');
      if (whoForm) {
        whoForm.reset();
      }

      const fileNamePc = getElement<HTMLElement>('#wholesale-registration-file-name');
      if (fileNamePc) {
        fileNamePc.innerHTML = 'Permission';
        fileNamePc.style.opacity = '0.3';
      }

      const fileName = getElement<HTMLElement>('#wholesale-registration-file-description-pc');
      if (fileName) {
        fileName.innerHTML = 'Wholesale purchase permission';
        fileName.style.opacity = '0.3';
      }

      const submitBtn = getElement<HTMLButtonElement>('#wholesale-registration-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        classManipulator(submitBtn, 'add', 'registration-form__submit_disabled');
      }

      errorContainer.forEach((item) => {
        item.innerText = '';
      });

      if (registrationContainer) {
        registrationContainer.style.height = '950px';
      }
    });

    const errorLabel = getElements<HTMLElement>('.just-validate-error-label');
    errorLabel.forEach((label) => {
      label.remove();
    });
  }
}
