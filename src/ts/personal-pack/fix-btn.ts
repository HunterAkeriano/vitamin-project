import { classManipulator, getElement } from '../composables/use-call-dom.ts';

export function unfixBtn() {
  const container = getElement('.your-pack');
  const button = getElement('.your-pack__continue');

  if (!container || !button) return;

  window.addEventListener('scroll', () => {
    fixBtn(container, button);
  });

  window.addEventListener('resize', () => {
    fixBtn(container, button);
  });

  fixBtn(container, button);
}

function fixBtn(container: HTMLElement, button: HTMLElement) {
  // if (window.innerWidth <= 768) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(() => {
        updateButtonPosition(container, button);
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(container);
  window.addEventListener('scroll', () => updateButtonPosition(container, button));
  window.addEventListener('resize', () => updateButtonPosition(container, button));

  return;
  // }
}

function updateButtonPosition(container: HTMLElement, button: HTMLElement) {
  const containerRect = container.getBoundingClientRect();

  if (window.innerWidth > 768) {
    classManipulator(button, 'remove', 'your-pack__continue_fixed');
    return;
  }

  if (containerRect.bottom <= window.innerHeight) {
    classManipulator(button, 'remove', 'your-pack__continue_fixed');
  } else {
    classManipulator(button, 'add', 'your-pack__continue_fixed');
  }
}
