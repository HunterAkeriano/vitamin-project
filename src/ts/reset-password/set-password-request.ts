import { setNewPassword } from '../composables/use-api.ts';
import { classManipulator, getElement } from '../composables/use-call-dom.ts';

export async function setPasswordRequest(data: { resetToken: string; newPassword: string }) {
  const messageContainer = getElement<HTMLElement>('.recover__message');
  const form = getElement<HTMLElement>('.recover__form_new-password');

  const res = await setNewPassword(data);

  if (!('errors' in res)) {
    if (messageContainer && form) {
      form.remove();
      messageContainer.innerHTML = `The password was successfully changed  <a class="recover__link-login" href="/Vitamin/login.html"> Back to login</a>`;
      classManipulator(messageContainer, 'remove', 'recover__message_hidden');
      messageContainer.style.color = 'green';
    }
    return;
  }

  if (messageContainer) {
    messageContainer.innerHTML = `Oops. Error, the password has not been changed. Try again later.<a class="recover__link-login" href="/Vitamin/login.html"> Back to login</a>`;
    classManipulator(messageContainer, 'remove', 'recover__message_hidden');
    messageContainer.style.color = 'red';
  }
}
