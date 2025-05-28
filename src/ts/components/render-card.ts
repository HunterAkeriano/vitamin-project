import { getCatalogList, getRecommendations } from '../composables/use-api.ts';
import { classManipulator, getElement, renderElement } from '../composables/use-call-dom.ts';
import { IntersectionObserverConfig, RecommendationData } from '../../typings/interfaces.ts';
import { stop } from './stopPreload.ts';
import { observe } from '../composables/use-observer.ts';

let currentPage = 1;
let itemsPerPage = 10;
let itemsViewMore = 6;
const windowWidth = window.innerWidth;
let currentCategory: string | undefined = undefined;
let hasMoreData = true;

export async function renderRecCard(container: string, colour: string) {
  const prodContainer = getElement(container);
  if (!prodContainer) return;

  try {
    const response = await getRecommendations(false);

    const prodList = response.data;
    card(prodList, prodContainer, colour);
    stop();
  } catch (error) {
    console.error(error);
  }
}

function updateItemsPerPage() {
  const newWindowWidth = window.innerWidth;

  if (newWindowWidth < 375) {
    itemsPerPage = 4;
    itemsViewMore = 2;

    return;
  }

  if (newWindowWidth < 768) {
    itemsPerPage = 6;
    itemsViewMore = 6;

    return;
  }

  itemsPerPage = 10;
  itemsViewMore = 10;
}

export async function renderAllCard(container: string, page: number = 1, category?: string) {
  updateItemsPerPage();
  const prodContainer = getElement(container);
  if (!prodContainer) return;

  try {
    let response = await getCatalogList(page, itemsPerPage, category);

    hasMoreData = true;

    if (response.errors || response.data.length === 0) {
      prodContainer.innerHTML = '<p>Нет товаров в данной категории</p>';
      return;
    }

    const prodList = response.data;
    card(prodList, prodContainer, 'gray');

    if (windowWidth >= 768) setupLazyLoading(container, category);
    if (windowWidth < 768) await handleViewMoreButtonVisibility(container, category);

    stop();
  } catch (error) {
    console.error(error);
  }
}

function card(data: RecommendationData[], container: HTMLElement, colour: string) {
  data.forEach((prodItem) => {
    const card = renderElement<HTMLAnchorElement>('a', ['prod-card', `${prodItem.id}`, `prod-card_${colour}`, 'skeleton']);
    card.href = `/Vitamin/one-product.html?id=${prodItem.id}`;
    const cardContainer = renderElement('div', 'prod-card__content');

    const cardImg = renderElement('div', 'prod-card__img');
    cardImg.innerHTML = `
        <picture>
           <source srcset="${prodItem.img.img_webp}" type="image/webp">
           <img src="${prodItem.img.img_default}" alt="prod" width="${prodItem.img.img_width}" height="${prodItem.img.img_height}" loading="lazy"/>
        </picture>`;

    const cardDiscount = renderElement('div', 'prod-card__discount');
    cardDiscount.innerText = `-${prodItem.discount}%`;

    const cardInfo = renderElement('div', ['prod-card__info', 'info']);
    const category = renderElement('p', 'info__category');
    applyCategoryClass(prodItem.type, category);

    category.innerText = prodItem.type;

    const name = renderElement('p', 'info__name');
    name.innerText = prodItem.name;

    const priceDiscount = getDiscountedPrice(prodItem.price, prodItem.discount);
    const price = renderElement('p', 'info__price');

    if (prodItem.type === 'Sale%') {
      price.innerHTML = `<span>$${prodItem.price}</span> $${priceDiscount}`;
      classManipulator(price, 'add', 'info__price_sale');
    } else {
      price.innerText = `$${prodItem.price}`;
    }

    cardInfo.appendChild(category);
    cardInfo.appendChild(name);
    cardInfo.appendChild(price);

    cardContainer.appendChild(cardImg);
    if (prodItem.type === 'Sale%') {
      cardContainer.appendChild(cardDiscount);
    }
    cardContainer.appendChild(cardInfo);

    card.appendChild(cardContainer);
    container.appendChild(card);
  });
}

function applyCategoryClass(type: string, categoryElement: HTMLElement) {
  const categoryClasses: { [key: string]: string } = {
    'Vitamins & Dietary Supplements': 'info__category_purple',
    Minerals: 'info__category_green-mint',
    'Prenatal Vitamins': 'info__category_pink',
    'Pain Relief': 'info__category_blue',
    Antioxidants: 'info__category_orange',
    'Weight Loss': 'info__category_dark-blue',
    Probiotics: 'info__category_red',
    'Sale%': 'info__category_red',
  };

  if (categoryClasses[type]) {
    classManipulator(categoryElement, 'add', categoryClasses[type]);
  }
}

export function getDiscountedPrice(price: string, discount: number): string {
  const originalPrice = parseFloat(price);

  if (isNaN(originalPrice)) {
    throw new Error('Invalid price format');
  }

  const discountedPrice = originalPrice * (1 - discount / 100);

  return discountedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function setupLazyLoading(container: string, category?: string) {
  const prodContainer = getElement(container);
  if (!prodContainer || prodContainer.children.length === 0) return;

  const loadMoreCardsObserverConfig: IntersectionObserverConfig = {
    callback: async (entries, obs) => {
      const lastCard = entries[0];

      if (lastCard.isIntersecting) {
        obs.disconnect();
        await loadMoreCards(container, category);

        if (hasMoreData) setupLazyLoading(container, category);
      }
    },
    options: { threshold: 1.0 },
  };

  const lastCardElement = prodContainer.lastElementChild;
  if (lastCardElement) {
    observe(lastCardElement, loadMoreCardsObserverConfig);
  }
}

async function loadMoreCards(container: string, category?: string) {
  const prodContainer = getElement(container);
  if (!prodContainer) return;

  const prevScrollTop = prodContainer.scrollTop;
  const prevHeight = prodContainer.scrollHeight;

  prodContainer.style.height = prevHeight + 'px';

  if (category !== currentCategory) {
    currentPage = 2;
    currentCategory = category;
  } else {
    currentPage++;
  }

  try {
    const response = await getCatalogList(currentPage, itemsViewMore, category);

    if (response.errors || response.data.length === 0) {
      hasMoreData = false;
      return;
    }

    card(response.data, prodContainer, 'gray');

    stop();
    setTimeout(() => {
      prodContainer.style.height = 'auto';
      prodContainer.scrollTop = prevScrollTop;
    }, 0);
  } catch (error) {
    console.error(error);
  }
}

export async function handleViewMoreButtonVisibility(container: string, category?: string) {
  const viewMoreButton = getElement('.catalog-list__view-more');
  if (!viewMoreButton) return;

  currentCategory = category;
  currentPage = 1;

  try {
    let totalItemsResponse = await getCatalogList(1, 1, category);

    const totalItems = totalItemsResponse.meta.totalItems;
    const prodContainer = getElement(container);
    if (!prodContainer) return;

    let currentItemCount = prodContainer.children.length;
    let remainingItems = totalItems - currentItemCount;

    viewMoreButton.style.display = remainingItems > 0 ? 'flex' : 'none';

    viewMoreButton.replaceWith(viewMoreButton.cloneNode(true));
    const newViewMoreButton = getElement('.catalog-list__view-more') as HTMLButtonElement;

    newViewMoreButton.addEventListener('click', async () => {
      if (remainingItems > 0) {
        try {
          await loadMoreCards(container, currentCategory);
          currentItemCount = prodContainer.children.length;
          remainingItems = totalItems - currentItemCount;

          newViewMoreButton.style.display = remainingItems > 0 ? 'flex' : 'none';
        } catch (error) {
          console.error(error);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}
