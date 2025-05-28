import JustValidate from 'just-validate';
import { LoginData, loginRequest } from './login-request.ts';

export function validateLoginForm() {



    const validator = new JustValidate('#login-form');

    validator
      .addField('#regular-login-email', [
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
      .addField('#login-password', [
        {
          rule: 'required',
          errorMessage: 'Password is required',
        },
        {
          rule: 'minLength',
          value: 8,
          errorMessage: 'Password must be at least 8 characters long',
        },
        {
          rule: 'maxLength',
          value: 30,
          errorMessage: 'Password must be less than 30 characters',
        },
      ])
      .onSuccess( async () => {

        const form = document.getElementById('login-form');

        if (!(form instanceof HTMLFormElement)) return;
        const formData: FormData = new FormData(form);

        const data: LoginData = {
          email: formData.get('email')!.toString(),
          password: formData.get('password')!.toString(),
        };

        await loginRequest(data)
      })


}