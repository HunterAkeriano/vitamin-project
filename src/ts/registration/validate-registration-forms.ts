import { getElement } from '../composables/use-call-dom.ts';
import { registrationRequest } from './registration-request.ts';
import JustValidate from 'just-validate';

export function validateWholesaleForm() {
  const validator = new JustValidate('#wholesale-registration', {
    fallback: false,
  });

  validator
    .addField('#wholesale-registration-email', [
      {
        rule: 'required',
        errorMessage: 'Email is required',
      },
      {
        rule: 'customRegexp',
        value: /^[a-zA-Z0-9а-яА-Я."_%+-]+@[a-zA-Zа-яА-Я0-9-.]+\.[a-zA-Zа-яА-Я]{2,}$/u,
        errorMessage: 'Enter a valid email address!',
      },
    ])
    .addField('#wholesale-registration-first-name', [
      {
        rule: 'required',
        errorMessage: 'First name is required',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'First name must be at least 2 characters',
      },
      {
        rule: 'maxLength',
        value: 30,
        errorMessage: 'First name must be at most 30 characters',
      },
      {
        rule: 'customRegexp',
        value: /^[A-Za-zА-Яа-яЁё]+$/,
        errorMessage: 'First name must contain only letters',
      },
    ])
    .addField('#wholesale-registration-last-name', [
      {
        rule: 'required',
        errorMessage: 'Last name is required',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Last name must be at least 2 characters',
      },
      {
        rule: 'maxLength',
        value: 30,
        errorMessage: 'Last name must be at most 30 characters',
      },
      {
        rule: 'customRegexp',
        value: /^[A-Za-zА-Яа-яЁё]+$/,
        errorMessage: 'Last name must contain only letters',
      },
    ])
    .addField('#wholesale-registration-password', [
      {
        rule: 'required',
        errorMessage: 'Password is required',
      },
      {
        rule: 'minLength',
        value: 8,
        errorMessage: 'Password must be at least 8 characters',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Password must be at most 50 characters',
      },
      {
        rule: 'customRegexp',
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        errorMessage: 'Must contain uppercase, lowercase letter, and number',
      },
    ])
    .addField('#wholesale-registration-file', [
      {
        rule: 'required',
        errorMessage: 'File is required',
      },
      {
        validator: () => {
          const fileInput = getElement<HTMLInputElement>('#wholesale-registration-file');
          if (!fileInput || !fileInput.files || fileInput.files.length === 0) return false;

          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
          return allowedTypes.includes(fileInput.files[0].type);
        },
        errorMessage: 'Only image (JPG, PNG, webp) are allowed',
      },
    ])
    .onSuccess(async () => {
      const form = getElement<HTMLFormElement>('#wholesale-registration');
      if (!form) return;
      const submitBtn = getElement<HTMLButtonElement>('#wholesale-registration button[type="submit"]', form);
      submitBtn?.removeAttribute('data-just-validate-fallback-disabled');
      const formData = new FormData(form);

      const data = {
        role_type: 'whosale',
        email: formData.get('email')?.toString() ?? '',
        first_name: formData.get('first_name')?.toString() ?? '',
        last_name: formData.get('last_name')?.toString() ?? '',
        password: formData.get('password')?.toString() ?? '',
      };
      await registrationRequest(data);
    });
}
