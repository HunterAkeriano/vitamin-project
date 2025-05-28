import JustValidate from 'just-validate';
import { setPasswordRequest } from './set-password-request.ts';
import { getElement } from '../composables/use-call-dom.ts';

export function validatePassword() {
  const validator = new JustValidate('#reset-password-form');

  validator

    .addField('#reset-password', [
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
        errorMessage: 'Must contain uppercase ,lowercase letter, and number',
      },
    ])
    .onSuccess(async () => {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('reset');

      const newPassword = getElement('#reset-password');
      if (newPassword instanceof HTMLInputElement && token) {
       await setPasswordRequest({
          resetToken: token,
          newPassword: newPassword.value,
        });
      }
    });
}
