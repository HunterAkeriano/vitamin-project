import JustValidate from 'just-validate';
import { getElement } from '../composables/use-call-dom.ts';

export function validateNameForm(): Promise<boolean> {
  return new Promise((resolve) => {
    const form = getElement<HTMLFormElement>('#firstQuestion');
    const firstNameInput = getElement<HTMLInputElement>('#firstName');

    if (!form || !firstNameInput) {
      resolve(false);
      return;
    }

    const validator = new JustValidate(form, {
      focusInvalidField: true,
      lockForm: true,
      validateBeforeSubmitting: true,
    });

    validator.addField('#firstName', [
      {
        rule: 'required',
        errorMessage: 'This field is required',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Must be at least 2 characters',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Must be less than 50 characters',
      },
      {
        rule: 'customRegexp',
        value: /^[\p{L}]+$/u,
        errorMessage: 'Only letters are allowed',
      },
    ]);

    firstNameInput.addEventListener('blur', () => validator.revalidateField('#firstName'));

    if (document.readyState === 'complete') {
      validator.revalidate().then((isValid: boolean) => {
        if (isValid) {
          localStorage.setItem('firstName', firstNameInput.value);
        }

        resolve(isValid);
      });

      return;
    }

    resolve(false);
  });
}

export function validateEmailForm(): Promise<boolean> {
  return new Promise((resolve) => {
    const form = getElement<HTMLFormElement>('#emailQuestion');
    const firstEmailInput = getElement<HTMLInputElement>('#email');

    if (!form || !firstEmailInput) {
      resolve(false);
      return;
    }

    const validator = new JustValidate(form, {
      focusInvalidField: true,
      lockForm: true,
      validateBeforeSubmitting: true,
    });

    validator.addField('#email', [
      {
        rule: 'required',
        errorMessage: 'This field is required',
      },
      {
        rule: 'customRegexp',
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})$/,
        errorMessage: 'Write correct email',
      },
    ]);

    firstEmailInput.addEventListener('blur', () => validator.revalidateField('#email'));

    if (document.readyState === 'complete') {
      validator.revalidate().then((isValid: boolean) => {
        resolve(isValid);
      });

      return;
    }

    resolve(false);
  });
}
