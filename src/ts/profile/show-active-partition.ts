import { classManipulator, getElement, getElements } from '../composables/use-call-dom.ts';

export function showActivePartition() {
  const url = new URL(window.location.href);
  const activePartition: string | null = url.searchParams.get('part') ? url.searchParams.get('part') : 'subscriptions';

  const partitions = getElements<HTMLDivElement>('.profile-page__partition-item');
  const menuItems = getElements('.profile-page__menu-item');

  if (partitions.length > 0 && activePartition) {
    partitions.forEach((item: HTMLDivElement) => {
      const part: string | null = item.getAttribute('part');

      if (part === activePartition) {
        item.classList.remove('profile-page__partition-item_hidden');
      } else {
        if (!item.classList.contains('profile-page__partition-item_hidden')) {
          item.classList.add('profile-page__partition-item_hidden');
        }
      }
    });
  }

  if (menuItems.length > 0) {
    menuItems.forEach((menuItem) => {
      const itemAttribute = menuItem.getAttribute('part');
      if (activePartition === itemAttribute) {
        classManipulator(menuItem, 'add', 'profile-page__menu-item_active');
      } else {
        classManipulator(menuItem, 'remove', 'profile-page__menu-item_active');
      }
    });
  }

  const wrapperPage = getElement<HTMLDivElement>('.wrapper-profile');
  const loader = getElement<HTMLDivElement>('.profile-loader');

  if (wrapperPage instanceof HTMLDivElement && loader instanceof HTMLDivElement) {
    wrapperPage.style.opacity = '1';
    loader.style.display = 'none';
  }
}
