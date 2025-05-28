import Cookies from 'js-cookie';
import { getElement } from '../composables/use-call-dom.ts';

export function authPopUp() {
  const popup = document.getElementById('authPopup');
  const openButton = getElement('.header__profile');
  const token = Cookies.get('accessToken');
  if (!(popup instanceof HTMLDialogElement)) return;
  const closeButton = getElement('.auth-pop-up__close', popup);
  const container = getElement('.auth-pop-up__container', popup);

  if (openButton) {
    openButton.addEventListener('click', () => {
      if (token) {
        window.location.href = '/Vitamin/profile.html';
        return;
      }
      popup.show();
    });
  }

  (window as any).showPopup = function (): void {
    popup.show();
  };

  if (!(closeButton instanceof HTMLButtonElement)) return;
  closeButton.addEventListener('click', () => {
    popup.close();
  });

  popup.addEventListener('click', (e: MouseEvent) => {
    if (!(container instanceof HTMLDivElement)) return;
    const target: EventTarget | null = e.target;

    if (target instanceof Node && !container.contains(target)) {
      popup.close();
    }
  });
}
