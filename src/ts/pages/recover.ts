import { validateRecoverForm } from '../recover/validate-recover-form.ts';
import { showPassword } from '../recover/show-password.ts';


document.addEventListener('DOMContentLoaded', () => {
  validateRecoverForm()
  showPassword()
});