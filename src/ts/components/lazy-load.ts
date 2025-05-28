import { getElements } from '../composables/use-call-dom.ts';
import { observe } from '../composables/use-observer.ts';
import { IntersectionObserverConfig } from '../../typings/interfaces.ts';

export type LazyModule = {
  importFn: () => Promise<{ default: () => Promise<void> | void }>;
  selector: string;
};

export function useLoadFunction(importFn: LazyModule['importFn'], selector: string): void {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) return;

  const observerConfig: IntersectionObserverConfig = {
    callback: async (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          try {
            const module = await importFn();
            await module.default();
          } catch (error) {
            console.error(`Ошибка загрузки модуля для ${selector}:`, error);
          }
        }
      }
    },
    options: { threshold: 0.1 },
  };

  observe(element, observerConfig);
}

export function lazyImg() {
  document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = getElements<HTMLImageElement>('img.lazy');

    const lazyImageObserverConfig: IntersectionObserverConfig = {
      callback: (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      },
      options: { rootMargin: '100px' },
    };

    lazyImages.forEach((img) => observe(img, lazyImageObserverConfig));
  });
}
