import { handleViewMoreButtonVisibility, renderAllCard, setupLazyLoading } from '../components/render-card';
import { classManipulator, getElement, getElements } from '../composables/use-call-dom.ts';
import { stop } from '../components/stopPreload.ts';

const filterParametrs = getElements('.filter__item');
const dropdownActiveItem = getElement('.catalog__content .dropdown__text');
const container = '.catalog-list__content';

export default async function filterList() {
  if (!filterParametrs || !dropdownActiveItem || !container) return;

  const urlParams = new URLSearchParams(window.location.search);
  let page = 1;
  let selectedCategory = urlParams.get('category') || undefined;

  filterParametrs.forEach((filter) => {
    const category = filter.innerText.trim();
    if ((!selectedCategory && category === 'All categories') || category === selectedCategory) {
      classManipulator(filter, 'add', 'filter__item_active');
      dropdownActiveItem.innerText = category;
    } else {
      classManipulator(filter, 'remove', 'filter__item_active');
    }
  });

  await renderAllCard(container, page, selectedCategory);
  if (window.innerWidth >= 768) setupLazyLoading(container, selectedCategory);
  if (window.innerWidth < 768) await handleViewMoreButtonVisibility(container, selectedCategory);

  stop();

  filterParametrs.forEach((filter) => {
    filter.addEventListener('click', async () => {
      const category = filter.innerText.trim();
      page = 1;

      if (category === 'All categories') {
        urlParams.delete('category');
        selectedCategory = undefined;
      } else {
        urlParams.set('category', category);
        selectedCategory = category;
      }

      window.history.pushState({}, '', `?${urlParams.toString()}`);

      const prodContainer = getElement(container);
      if (prodContainer) {
        prodContainer.innerHTML = '';
      }

      filterParametrs.forEach((item) => {
        classManipulator(item, 'remove', 'filter__item_active');
      });

      classManipulator(filter, 'add', 'filter__item_active');

      await renderAllCard(container, page, selectedCategory);
    });
  });
}
