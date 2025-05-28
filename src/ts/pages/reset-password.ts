import { resetPassword } from '../reset-password/reesset-password.ts';
import { validatePassword } from '../reset-password/validate-set-password.ts';


document.addEventListener('DOMContentLoaded', async () => {

  await resetPassword()
  validatePassword()
});