import Cookies from 'js-cookie';
import { getElements } from '../composables/use-call-dom.ts';

export function logout() {
  const logoutButtons = getElements('.sign-out');
  logoutButtons.forEach((logoutButton) => {
    logoutButton.addEventListener('click', () => {
      window.location.href = '/Vitamin';
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('orderInfo');
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('refreshToken', { path: '/' });
    });
  });
}
