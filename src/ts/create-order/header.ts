import { getElement } from '../composables/use-call-dom.ts';

const header = getElement('.header');

export default function createOrderHeader() {
  addBgScroll();
}

function addBgScroll() {
  updateHeader();

  window.addEventListener('scroll', updateHeader);
}

function updateHeader() {
  if (!header) return;

  if (window.scrollY > 50) {
    header.style.backgroundColor = 'white';
    header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    header.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease';

    return;
  }

  header.style.backgroundColor = 'transparent';
  header.style.boxShadow = 'none';
}
