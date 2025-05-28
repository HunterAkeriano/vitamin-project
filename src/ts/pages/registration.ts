import { fileUpload } from '../registration/file-upload.ts';
import { flipFormCard } from '../registration/fllip-form-card.ts';
import { validateWholesaleForm } from '../registration/validate-registration-forms.ts';
import { validateRegularForm } from '../registration/validate-registration-form-regular.ts';





document.addEventListener('DOMContentLoaded', () => {

  fileUpload()
  flipFormCard()
  validateRegularForm()
  validateWholesaleForm()

});