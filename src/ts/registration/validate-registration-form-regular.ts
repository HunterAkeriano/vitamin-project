import JustValidate from 'just-validate';
import { registrationRequest } from './registration-request.ts';
import { getElement } from '../composables/use-call-dom.ts';

export function validateRegularForm() {
  const validator = new JustValidate('#regular-registration');

  validator
    .addField('#regular-registration-email', [
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
    .addField('#regular-registration-first-name', [
      {
        rule: 'required',
        errorMessage: 'Name required',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'The name must contain a minimum of 2 characters',
      },
      {
        rule: 'maxLength',
        value: 30,
        errorMessage: 'The name must not exceed 30 characters',
      },
      {
        rule: 'customRegexp',
        value: /^[A-Za-zА-Яа-яЁё]+$/,
        errorMessage: 'The name must contain only letters',
      },
    ])
    .addField('#regular-registration-last-name', [
      {
        rule: 'required',
        errorMessage: 'Last name required',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Last name must contain a minimum of 2 characters',
      },
      {
        rule: 'maxLength',
        value: 30,
        errorMessage: 'Last name must not exceed 30 characters',
      },
      {
        rule: 'customRegexp',
        value: /^[A-Za-zА-Яа-яЁё]+$/,
        errorMessage: 'The name must contain only letters',
      },
    ])
    .addField('#regular-registration-password', [
      {
        rule: 'required',
        errorMessage: 'Password required',
      },
      {
        rule: 'minLength',
        value: 8,
        errorMessage: 'Password must contain a minimum of 8 characters',
      },
      {
        rule: 'maxLength',
        value: 50,
        errorMessage: 'Password must not exceed 50 characters',
      },
      {
        rule: 'customRegexp',
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        errorMessage: 'Must contain uppercase, lowercase letter, and number',
      },
    ])
    .onSuccess(async () => {
      const form = getElement<HTMLFormElement>('#regular-registration');
      if (!form) return;

      const formData = new FormData(form);
      const data = {
        role_type: 'regular',
        email: formData.get('email')?.toString() ?? '',
        first_name: formData.get('first_name')?.toString() ?? '',
        last_name: formData.get('last_name')?.toString() ?? '',
        password: formData.get('password')?.toString() ?? '',
      };

      await registrationRequest(data);
    });
}
