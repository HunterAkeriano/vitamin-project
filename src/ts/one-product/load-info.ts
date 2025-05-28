import { initDropdown } from '../components/dropdown';
import { Product } from '../../typings/interfaces.ts';
import { getCatalogItem } from '../composables/use-api.ts';
import { classManipulator, getElement } from '../composables/use-call-dom.ts';
import { autoshipCreate } from './autoship';
import { initCounter } from '../components/counter.ts';
import { addToCartBtn } from './add-to-cart.ts';

const urlParams = new URLSearchParams(window.location.search);
const prodId = urlParams.get('id') || undefined;

const autoshipDropdown = getElement('.autoship__dropdown');

const ilustrate = getElement('.ilustrate');
const catgory = getElement<HTMLAnchorElement>('.info__category');
const svgIco = getElement('.count__svg svg use');
const name = getElement('.info__name');
const capsules = getElement('.count__capsules span');
const mg = getElement('.count__mg span');
const autoshipText = getElement('.autoship__text');
const price = getElement('.add-to-cart__price');
const description = getElement('.descripton__info');
const safetyInf = getElement('.safety .inf');
const indications = getElement('.indications .inf');
const ingredients = getElement('.ingredients .inf');
const directions = getElement('.directions .inf');
const legal = getElement('.legal .inf');

const requiredFields = [ilustrate, catgory, svgIco, name, capsules, mg, autoshipText, price, description, safetyInf, indications, ingredients, directions, legal];

const minusBtn = getElement('.count__minus');
const plusBtn = getElement('.count__plus');
const countEl = getElement('.count__items');

export default async function loadInfo() {
  if (!prodId || !autoshipDropdown) return;

  try {
    const prod = await getCatalogItem(prodId);

    await addToCartBtn(prod);

    initCounter('.count__counter');

    showInfo(prod);
    backToShop();
    autoshipBtn(prod);

    initDropdown(autoshipDropdown);
  } catch (error) {
    console.error(error);
  }
}

function getItem(item: HTMLElement | HTMLAnchorElement | null): HTMLElement | HTMLAnchorElement | undefined {
  if (item) return item;
}

function setItem(item: HTMLElement | null, operation: 'innerText' | 'innerHTML', text: string) {
  if (!item) return;
  switch (operation) {
    case 'innerText':
      item.textContent = text;
      break;
    case 'innerHTML':
      item.innerHTML = text;
      break;
  }
}

function showInfo(prodInfo: Product) {
  if (requiredFields.some((field) => !field)) return;

  switch (prodInfo.type) {
    case 'Vitamins & Dietary Supplements':
      classManipulator(getItem(ilustrate), 'add', 'ilustrate_purple');
      break;
    case 'Minerals':
      classManipulator(getItem(ilustrate), 'add', 'ilustrate_green-mint');
      break;
    case 'Prenatal Vitamins':
      classManipulator(getItem(ilustrate), 'add', 'ilustrate_pink');
      break;
    case 'Pain Relief':
      classManipulator(getItem(ilustrate), 'add', 'ilustrate_blue');
      break;
    case 'Antioxidants':
      classManipulator(getItem(ilustrate), 'add', 'ilustrate_orange');
      break;
    case 'Weight Loss':
      classManipulator(getItem(ilustrate), 'add', 'ilustrate_dark-blue');
      break;
    case 'Probiotics':
      classManipulator(getItem(ilustrate), 'add', 'ilustrate_red');
      break;
    case 'Sale%':
      classManipulator(getItem(ilustrate), 'add', 'ilustrate_red');
      break;
    default:
      break;
  }

  const img = getElement('.ilustrate__content');
  if (!img) return;
  img.innerHTML = `
     <picture>
        <source srcset="${prodInfo.img.img_webp}" type="image/webp">
        <img src="${prodInfo.img.img_default}" alt="prod" width="${prodInfo.img.img_width}" height="${prodInfo.img.img_height}"/>
     </picture>`;

  if (!catgory) return;

  switch (prodInfo.type) {
    case 'Vitamins & Dietary Supplements':
      classManipulator(getItem(catgory), 'add', 'info__category_purple');
      catgory.href = '/Vitamin/shop.html?category=Vitamins+%26+Dietary+Supplements';
      getItem(svgIco)?.setAttribute('href', '#can');
      break;
    case 'Minerals':
      classManipulator(getItem(catgory), 'add', 'info__category_green-mint');
      catgory.href = '/Vitamin/shop.html?category=Minerals';
      getItem(svgIco)?.setAttribute('href', '#bottle');
      break;
    case 'Prenatal Vitamins':
      classManipulator(getItem(catgory), 'add', 'info__category_pink');
      catgory.href = '/Vitamin/shop.html?category=Prenatal+Vitamins';
      getItem(svgIco)?.setAttribute('href', '#kit');
      break;
    case 'Pain Relief':
      classManipulator(getItem(catgory), 'add', 'info__category_blue');
      catgory.href = '/Vitamin/shop.html?category=Pain+Relief';
      getItem(svgIco)?.setAttribute('href', '#box');
      break;
    case 'Antioxidants':
      classManipulator(getItem(catgory), 'add', 'info__category_orange');
      catgory.href = '/Vitamin/shop.html?category=Antioxidants';
      getItem(svgIco)?.setAttribute('href', '#can');
      break;
    case 'Weight Loss':
      classManipulator(getItem(catgory), 'add', 'info__category_dark-blue');
      catgory.href = '/Vitamin/shop.html?category=Weight+Loss';
      getItem(svgIco)?.setAttribute('href', '#bottle');
      break;
    case 'Probiotics':
      classManipulator(getItem(catgory), 'add', 'info__category_red');
      catgory.href = '/Vitamin/shop.html?category=Probiotics';
      getItem(svgIco)?.setAttribute('href', '#kit');
      break;
    case 'Sale%':
      classManipulator(getItem(catgory), 'add', 'info__category_red');
      catgory.href = '/Vitamin/shop.html?category=Sale%25';
      getItem(svgIco)?.setAttribute('href', '#kit');
      break;
    default:
      break;
  }

  setItem(catgory, 'innerText', prodInfo.type);
  setItem(name, 'innerText', prodInfo.name);
  setItem(capsules, 'innerText', prodInfo.capsules.toString());
  setItem(mg, 'innerText', prodInfo.weight_mg.toString());

  if (window.innerWidth < 768) {
    setItem(autoshipText, 'innerText', 'Deliver every');
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
      setItem(autoshipText, 'innerText', 'Deliver every');
    }
    if (window.innerWidth >= 768) {
      setItem(autoshipText, 'innerText', 'Autoship this item every');
    }
  });

  const priceDiscount = getDiscountedPrice(prodInfo.price, prodInfo.discount);

  if (prodInfo.type === 'Sale%') {
    classManipulator(getItem(price), 'add', 'add-to-cart__price_sale');
    setItem(price, 'innerHTML', `<span><span class="price">$${prodInfo.price}</span> <span class="discount">-${prodInfo.discount}%</span></span> $${priceDiscount}`);
  } else {
    setItem(price, 'innerText', `$${prodInfo.price}`);
  }

  updatePrice(getItem(price), prodInfo);

  setItem(description, 'innerText', prodInfo.description);
  setItem(safetyInf, 'innerText', prodInfo.satefy_information);
  setItem(indications, 'innerText', prodInfo.indications);
  setItem(ingredients, 'innerText', prodInfo.ingradients);
  setItem(directions, 'innerText', prodInfo.directions);
  setItem(legal, 'innerText', prodInfo.legal_disclaimer);
}

function backToShop() {
  const backBtn = getElement('.info__backbtn');

  if (!backBtn) return;

  backBtn.addEventListener('click', () => {
    window.location.href = '/Vitamin/shop.html';
  });
}

function autoshipBtn(prodInfo: Product) {
  const autoship = getElement('.autoship__on-off');
  if (!autoship) return;

  const autoshipCircle = getElement('.autoship__circle', autoship);
  if (!autoshipCircle) return;

  if (prodInfo.disabled_subscribe === true) {
    autoship.addEventListener('click', async (event: Event) => {
      autoship.classList.toggle('autoship__on-off_active');
      autoshipCircle.classList.toggle('autoship__circle_active');

      await autoshipCreate(event);
    });
  }
}

function getDiscountedPrice(price: string, discount: number, count: number = 1): string {
  const originalPrice = parseFloat(price);
  if (isNaN(originalPrice)) {
    throw new Error('Invalid price format');
  }

  const unitPrice = Math.round(originalPrice * (1 - discount / 100) * 100) / 100;

  const totalPrice = Math.round(unitPrice * count * 100) / 100;

  return totalPrice.toFixed(2);
}

function getTotalPrice(price: string, count: number = 1): string {
  const originalPrice = parseFloat(price);
  if (isNaN(originalPrice)) {
    throw new Error('Invalid price format');
  }

  const totalPrice = originalPrice * count;

  return totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updatePrice(el: HTMLElement | undefined, prod: Product) {
  if (!el || !plusBtn || !minusBtn || !countEl) return;

  let count = Number(countEl.innerText);
  let totalPrice = '';
  let discountPrice = '';

  plusBtn.addEventListener('click', () => {
    plusMunusEvent(count, countEl, totalPrice, discountPrice, el, prod);
  });

  minusBtn.addEventListener('click', () => {
    plusMunusEvent(count, countEl, totalPrice, discountPrice, el, prod);
  });
}

function plusMunusEvent(count: number, countEl: HTMLElement, totalPrice: string, discountPrice: string, el: HTMLElement, prod: Product) {
  count = Number(countEl.innerText);
  totalPrice = getTotalPrice(prod.price, count);
  discountPrice = getDiscountedPrice(prod.price, prod.discount, count);

  if (prod.type === 'Sale%') {
    el.innerHTML = `<span><span class="price">$${totalPrice}</span> <span class="discount">-${prod.discount}%</span></span> $${discountPrice}`;

    return;
  }

  el.innerText = `$${totalPrice}`;
}
