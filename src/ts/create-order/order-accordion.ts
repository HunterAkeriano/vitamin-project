import { getElement } from '../composables/use-call-dom.ts';

const accordion = getElement('.accordion');
const accordionContent = getElement('.accordion-content');

export default function initAccordion() {
  if (!accordion || !accordionContent) return;

  accordion.addEventListener('click', () => {
    accordion.classList.toggle('accordion_active');
    accordionContent.classList.toggle('accordion-content_active');
  });
}
