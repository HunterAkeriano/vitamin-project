import { updateCardInfo } from '../../composables/use-api.ts';
import { validate } from './validate-card.ts';
import { getElement } from '../../composables/use-call-dom.ts';

export interface paymentData {
  card_number: string;
  card_cvv: string;
  card_date: string;
}

export async function paymentRequest(data: paymentData) {
  const massageContainer: HTMLSpanElement | null = getElement('.payment-methods__message');

  const res = await updateCardInfo(data);
  if (!('errors' in res)) {
    if (massageContainer) {
      massageContainer.innerHTML = '<svg>\n' + '  <use href="#check-white"></use>\n' + '</svg> Changes successfully saved';
      massageContainer.style.background = 'green';
      massageContainer.classList.remove('hidden');
    }

    return;
  }

  if (!massageContainer) return;

  const field = `#${[res.errors[0].field!]}`;
  const errorsObj = { [field]: res.errors[0].message };
  validate.showErrors(errorsObj);
}
