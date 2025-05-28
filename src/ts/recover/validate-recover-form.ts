import JustValidate from 'just-validate';
import { recoverRequest } from './recover-request.ts';

export function validateRecoverForm() {
  const validator = new JustValidate('#recover-form');

  validator
    .addField('#recover-email', [
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
    .onSuccess(async () => {
      const form = document.getElementById('recover-email') as HTMLInputElement | undefined;

      if (form) {
        const value = form.value;
        if (value) {
          const data = {
            email: value,
          };

          await recoverRequest(data);
        }
      }
    });
}
