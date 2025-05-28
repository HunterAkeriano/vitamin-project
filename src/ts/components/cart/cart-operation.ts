import { getCatalogItem } from '../../composables/use-api.ts';
import { getElement } from '../../composables/use-call-dom.ts';
import { Product } from '../../../typings/interfaces.ts';
import { blockBtn, emptyBag, loadCartFromLocalStorage, renderProdCard, totalCartPrice, updateAutoshipInLocalStorage } from './render-cart.ts';

let empty: boolean;

export async function addAllToCart(prodsId: string[]) {
  for (const prodId of prodsId) {
    try {
      let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const prod = await getCatalogItem(prodId);

      const autoshipCheckbox = getElement<HTMLInputElement>(`.prod_${prod.id} .prod__checkbox input`);
      const autoshipDaysText = getElement(`.prod_${prod.id} .dropdown__text`);

      const productExists = cartItems.some((item: Product) => item.id === prod.id);

      if (!productExists) {
        renderProdCard(prod, true, '30', 1);
        totalCartPrice();
        blockBtn();
        continue;
      }

      const counterItems = getElement(`.prod_${prod.id} .counter__items`);
      if (!autoshipCheckbox || !autoshipDaysText || !counterItems) return;

      const counts = Number(counterItems.textContent) + 1;
      if (counts >= 999) {
        updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, autoshipDaysText.textContent || '30', 999);
      } else {
        updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, autoshipDaysText.textContent || '30', counts);
      }
      loadCartFromLocalStorage();

      totalCartPrice();
    } catch (error) {
      console.error(error);
    }
  }
}

export async function addAllToCartOrders(prodsIdAndCounts: { id: string; counts: number }[]) {
  for (const prodId of prodsIdAndCounts) {
    try {
      let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const prod = await getCatalogItem(prodId.id);

      const autoshipCheckbox = getElement<HTMLInputElement>(`.prod_${prod.id} .prod__checkbox input`);
      const autoshipDaysText = getElement(`.prod_${prod.id} .dropdown__text`);

      const productExists = cartItems.some((item: Product) => item.id === prod.id);

      if (!productExists) {
        renderProdCard(prod, false, '30', prodId.counts);
        totalCartPrice();
        blockBtn();
        continue;
      }

      const counterItems = getElement(`.prod_${prod.id} .counter__items`);
      if (!autoshipCheckbox || !autoshipDaysText || !counterItems) return;

      const counts = Number(counterItems.textContent) + prodId.counts;
      if (counts >= 999) {
        updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, autoshipDaysText.textContent || '30', 999);
      } else {
        updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, autoshipDaysText.textContent || '30', counts);
      }

      loadCartFromLocalStorage();

      totalCartPrice();
    } catch (error) {
      console.error(error);
    }
  }
}

export function addProdToCart(prod: Product) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  if (cartItems.length === 0) {
    empty = true;
    emptyBag(empty);
  }

  const productExists = cartItems.some((item: Product) => item.id === prod.id);

  if (!productExists) {
    renderProdCard(prod);
  }

  totalCartPrice();
  blockBtn();
}

export function addAutoship(prod: Product) {
  if (!prod.disabled_subscribe) return;

  const autoshipCheckbox = getElement<HTMLInputElement>(`.prod_${prod.id} .prod__checkbox input`);
  const autoshipDays = getElement(`.prod_${prod.id} .dropdown__text`);
  const autoshipDaysAddEl = getElement('.autoship__dropdown .dropdown__text');
  if (!autoshipDaysAddEl) return;
  const autoshipDaysAdd = autoshipDaysAddEl.textContent;
  const counterItems = getElement(`.prod_${prod.id} .counter__items`);

  if (!autoshipCheckbox || !autoshipDays || !autoshipDaysAdd || !counterItems) return;

  autoshipCheckbox.checked = true;
  autoshipDays.innerText = autoshipDaysAdd;

  updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, autoshipDays.textContent || '30', Number(counterItems.textContent));
}

export function removeAutoship(prod: Product) {
  if (!prod.disabled_subscribe) return;

  const autoshipCheckbox = getElement(`.prod_${prod.id} .prod__checkbox input`) as HTMLInputElement;
  const autoshipDays = getElement(`.prod_${prod.id} .dropdown__text`);
  const counterItems = getElement(`.prod_${prod.id} .counter__items`);

  if (!autoshipCheckbox || !autoshipDays || !counterItems) return;
  autoshipCheckbox.checked = false;

  updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, autoshipDays.textContent || '30', Number(counterItems.textContent));
}

export function addBtn(prod: Product) {
  const autoshipCheckbox = getElement<HTMLInputElement>(`.prod_${prod.id} .prod__checkbox input`);
  const autoshipDaysText = getElement(`.prod_${prod.id} .dropdown__text`);
  const counterItems = getElement(`.prod_${prod.id} .counter__items`);
  const addItems = getElement(`.count__counter .counter__items`);

  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  if (cartItems.length === 0) {
    empty = true;
    emptyBag(empty);
  }

  const productExists = cartItems.some((item: Product) => item.id === prod.id);

  if (!addItems) return;

  if (!productExists) {
    renderProdCard(prod, false, '30', Number(addItems.innerText));
    totalCartPrice();
    blockBtn();
    return;
  }

  if (!autoshipCheckbox || !autoshipDaysText || !counterItems) return;

  const counts = Number(counterItems.textContent) + Number(addItems.innerText);
  if (counts > 999 || counts == 999) {
    updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, autoshipDaysText.textContent || '30', 999);
  } else {
    updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, autoshipDaysText.textContent || '30', counts);
  }

  loadCartFromLocalStorage();

  totalCartPrice();
}
