import { resetPassword } from '../composables/use-api.ts';

export async function recoverRequest(data: { email: string }) {
  const container: HTMLElement | null = document.querySelector('.recover__container');
  const errormessageContainer: HTMLElement | null = document.querySelector('.recover__error-message');

  const res: any = await resetPassword(data);

  if (res.message === 'Посилання для відновлення пароля надіслано на пошту') {
    if (container) {
      container.innerHTML = `<div class="recover__successes-massage">You have been sent an e-mail</div>`;
    }
  } else {
    if (res.errors[0].message) {
      if (errormessageContainer) {
        switch (res.errors[0].message) {
          case 'Користувач не знайдений':
            errormessageContainer.innerText = 'User not found';
            break;

          default:
            errormessageContainer.innerText = 'Something went wrong... Try again later.';
        }
      }
    }
  }
}
