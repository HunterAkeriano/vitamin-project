import { IntersectionObserverConfig } from '../../typings/interfaces.ts';

let observers: IntersectionObserver[] = [];

export function createObserver(config: IntersectionObserverConfig) {
  const { callback, options = {}, multipleObservers = false } = config;

  const observer = new IntersectionObserver(callback, options);

  if (multipleObservers) {
    observers.push(observer);
  } else {
    return observer;
  }
}

export function observe(element: Element | Element[], config: IntersectionObserverConfig) {
  const observer = createObserver(config);

  if (!observer) return;

  if (Array.isArray(element)) {
    element.forEach((el) => observer.observe(el));
  } else {
    observer.observe(element);
  }
}
