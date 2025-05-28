import { changePassword } from '../../composables/use-api.ts';
import { validation } from '../change-password/validate-change-password.ts';
import { getElement } from '../../composables/use-call-dom.ts';

interface PasswordForm {
  old_password: string;
  new_password: string;
}

export async function changePasswordRequest(data: PasswordForm) {
  const massageContainer: HTMLSpanElement | null = getElement('.change-password__message');
  const formChangePassword = getElement('change-password');

  const res = await changePassword(data);

  if (!('errors' in res)) {
    if (massageContainer) {
      massageContainer.innerHTML = '<svg>\n' + '  <use href="#check-white"></use>\n' + '</svg> Changes successfully saved';
      massageContainer.style.background = 'green';
      massageContainer.classList.toggle('hidden');
    }
    if (formChangePassword instanceof HTMLFormElement) {
      formChangePassword.reset();
    }
    return;
  }
  const field = `#${[res.errors[0].field!]}`;
  const errorsObj = { [field]: res.errors[0].message };

  validation.showErrors(errorsObj);

  setTimeout(() => {
    if (massageContainer) {
      massageContainer.classList.add('hidden');
      massageContainer.innerHTML = '';
    }
  }, 5000);
}
