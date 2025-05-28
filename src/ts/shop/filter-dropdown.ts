import { getElement } from '../composables/use-call-dom.ts';
import { initDropdown } from '../components/dropdown.ts';

export default function dropdown() {
  const catalog = getElement('.catalog__content');

  if (!catalog) return;

  initDropdown(catalog);
}
