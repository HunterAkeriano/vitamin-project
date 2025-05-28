import { checkResetToken } from '../composables/use-api.ts';
import { getElement } from '../composables/use-call-dom.ts';

export async function resetPassword() {
  const url = new URL(window.location.href);
  const messageContainer: HTMLElement | null = getElement('.recover__message');
  const customLoader: HTMLElement | null = getElement('.custom-loader');
  const formNewPassword: HTMLElement | null = getElement('#reset-password-form');

  const token = url.searchParams.get('reset');

  if (token && messageContainer && customLoader && formNewPassword) {
    const res = await checkResetToken(token);

    if ('email' in res) {
      customLoader.style.display = 'none';
      formNewPassword.style.display = 'block';
    } else {
      window.location.href = '/Vitamin';
    }
  }
}
