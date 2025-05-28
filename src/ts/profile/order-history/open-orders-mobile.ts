import { classManipulator, getElements } from '../../composables/use-call-dom.ts';

export function openOrdersMobile(): void {
  const openButton: NodeListOf<HTMLElement> = getElements('.orderItem');
  const containerOrders: NodeListOf<HTMLElement> = getElements('.orderItem');

  openButton.forEach((item: HTMLElement) => {
    item.addEventListener('click', function (this: HTMLElement): void {
      const orderItem = this.closest('.orderItem');
      if (!orderItem) return;

      const orderBody = orderItem.querySelector('.orderItem__content');
      if (!(orderBody instanceof HTMLElement)) return;

      classManipulator(orderBody, 'add', 'orderItem__content_show');

      containerOrders.forEach((item: HTMLElement) => {
        if (item != orderItem) {
          const container = item.querySelector('.orderItem__content');
          if (container instanceof HTMLElement) {
            container.classList.remove('orderItem__content_show');
            classManipulator(container, 'remove', 'orderItem__content_show');
          }
        }
      });
    });
  });
}
