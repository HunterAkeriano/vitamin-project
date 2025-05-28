export function getElements<T extends HTMLElement>(selectors: string, target: T | Document = document): NodeListOf<T> {
  return target.querySelectorAll(selectors);
}

export function getElement<T extends HTMLElement>(selector: string, target: HTMLElement | Document = document): T | null {
  return target.querySelector(selector);
}

export function classManipulator(element: HTMLElement | undefined, action: 'add' | 'remove', className: string) {
  if (!element) return;

  if (action === 'add') {
    element.classList.add(className);
  } else if (action === 'remove') {
    element.classList.remove(className);
  }
}

export function renderElement<T extends HTMLElement>(element: string, elementsClass: string[] | string | null): T {
  const domElement = document.createElement(element) as T;

  if (elementsClass) {
    if (Array.isArray(elementsClass)) {
      elementsClass.forEach((item) => classManipulator(domElement, 'add', item));
      return domElement;
    }

    classManipulator(domElement, 'add', elementsClass);
  }

  return domElement;
}
