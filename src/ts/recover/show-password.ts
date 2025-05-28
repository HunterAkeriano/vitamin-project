import { getElement } from '../composables/use-call-dom.ts';

export function showPassword() {
  const switchButton = getElement('.field__password-icon')
  const iconOpen = getElement('.field__password-icon-open')
  const iconClose = getElement('.field__password-icon-close')
  const passwordInput = getElement<HTMLInputElement>('.field__input_password')
  if (switchButton && iconClose && iconOpen && passwordInput) {

    switchButton.addEventListener('click', () => {
        const isOpen = switchButton.classList.contains('show')
      if (isOpen) {
        iconOpen.style.opacity = '1'
        iconClose.style.opacity = '0'
        switchButton.classList.remove('show')
        passwordInput.type = 'email'
        return
      }
      iconOpen.style.opacity = '0'
      iconClose.style.opacity = '1'
      switchButton.classList.add('show')
      passwordInput.type = 'password'

    })
  }
}