import { updateProfile } from '../../composables/use-api.ts';
import { validation } from './overview-validete.ts';
import { getElement } from '../../composables/use-call-dom.ts';

interface FormData {
  first_name: string;
  last_name: string;
  address_one: string;
  address_two: string;
  city: string;
  state_province: string;
  postal_code: string;
  email: string;
  phone: string;
}

export async function overviewRequest(data: FormData) {
  const massageContainer: HTMLSpanElement | null = getElement('.overview__message');

  const res = await updateProfile(data);
  if (!('errors' in res)) {
    if (massageContainer) {
      massageContainer.innerHTML = '<svg>\n' + '  <use href="#check-white"></use>\n' + '</svg> Changes successfully saved';
      massageContainer.style.background = 'green';
      massageContainer.classList.toggle('hidden');
    }

    setTimeout(() => {
      if (massageContainer) {
        massageContainer.classList.add('hidden');
        massageContainer.innerHTML = '';
      }
    }, 5000);
    return;
  }
  const field = `#${[res.errors[0].field!]}`;
  const errorsObj = { [field]: res.errors[0].message };

  validation.showErrors(errorsObj);


}

