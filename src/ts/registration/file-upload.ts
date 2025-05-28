import { classManipulator, getElement } from '../composables/use-call-dom.ts';

export function fileUpload() {
  const fileInput = getElement('#wholesale-registration-file');
  const fileNameSpanPc = getElement('#wholesale-registration-file-description-pc');
  const fileNameSpanMobile = getElement('#wholesale-registration-file-name');
  const inputFileBtn = getElement('#registration-add-file-btn');
  const submitButton = getElement('#wholesale-registration-submit-btn');

  if (fileInput instanceof HTMLInputElement) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        if (window.innerWidth >= 567 && fileNameSpanPc) {
          const fileName = fileInput.files[0].name;
          const maxLength = 30;
          const truncatedFileName = fileName.length > maxLength ? fileName.slice(0, maxLength) + '...' : fileName;

          fileNameSpanPc!.textContent = truncatedFileName;
        } else {
          const fileName = fileInput.files[0].name;
          const maxLength = 30;
          const truncatedFileName = fileName.length > maxLength ? fileName.slice(0, maxLength) + '...' : fileName;
          fileNameSpanMobile!.textContent = truncatedFileName;
          fileNameSpanMobile!.style.opacity = '1';
        }
      }
    });
  }

  if (inputFileBtn && fileInput) {
    inputFileBtn.addEventListener('click', () => {
      fileInput.click();
    });
  }

  if (fileInput && submitButton instanceof HTMLButtonElement) {
    fileInput.addEventListener('change', () => {
      classManipulator(submitButton, 'remove', 'registration-form__submit_disabled');
      submitButton.disabled = false;
    });
  }
}
