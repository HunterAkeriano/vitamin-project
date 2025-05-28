import { Product, ProductLocalStorge } from '../../../typings/interfaces.ts';
import { classManipulator, getElement, getElements, renderElement } from '../../composables/use-call-dom.ts';
import { initCounter } from '../counter.ts';
import { initDropdown } from '../dropdown.ts';
import { getCatalogItem } from '../../composables/use-api.ts';

const cartContainer = getElement('.cart__items');
const cartBtn = getElement('.cart__btn');
const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '[]');

let empty: boolean;

export function renderProdCard(prod: Product, autoshipChecked: boolean = false, autoshipDays: string = '30', counts: number = 1) {
  if (!cartContainer) return;

  const prodCard = renderElement('div', ['cart__item', 'prod', `prod_${prod.id}`]);

  const prodImg = renderElement<HTMLAnchorElement>('a', 'prod__img');
  prodImg.href = `/Vitamin/one-product.html?id=${prod.id}`;

  switch (prod.type) {
    case 'Vitamins & Dietary Supplements':
      classManipulator(prodImg, 'add', 'prod__img_purple');
      break;
    case 'Minerals':
      classManipulator(prodImg, 'add', 'prod__img_green-mint');
      break;
    case 'Prenatal Vitamins':
      classManipulator(prodImg, 'add', 'prod__img_pink');
      break;
    case 'Pain Relief':
      classManipulator(prodImg, 'add', 'prod__img_blue');
      break;
    case 'Antioxidants':
      classManipulator(prodImg, 'add', 'prod__img_orange');
      break;
    case 'Weight Loss':
      classManipulator(prodImg, 'add', 'prod__img_dark-blue');
      break;
    case 'Probiotics':
      classManipulator(prodImg, 'add', 'prod__img_red');
      break;
    case 'Sale%':
      classManipulator(prodImg, 'add', 'prod__img_red');
      break;
  }

  prodImg.innerHTML = `
    <picture>
      <source srcset="${prod.img.img_webp}" type="image/webp">
      <img src="${prod.img.img_default}" alt="prod" width="${prod.img.img_width}" height="${prod.img.img_height}" />
    </picture>`;

  const prodInfo = renderElement('div', 'prod__info');

  const titleAndClose = renderElement('div', 'prod__title-and-close');

  const prodTitle = renderElement<HTMLAnchorElement>('a', 'prod__title');
  prodTitle.href = `/Vitamin/one-product.html?id=${prod.id}`;
  prodTitle.innerText = prod.name;

  const prodRmove = renderElement('div', 'prod__close');
  prodRmove.innerHTML = `
    <span></span>
    <span></span>
  `;

  const counterAndPrice = renderElement('div', 'prod__counter-and-price');

  const counter = renderElement('div', 'prod__counter');

  counter.innerHTML = `
    <button class="counter__minus">
      <svg>
        <use href="#minus"></use>
      </svg>
    </button>
    
    <p class="counter__items">${counts}</p>
    
    <button class="counter__plus">
      <svg>
        <use href="#plus"></use>
      </svg>
    </button>
  `;

  initCounter(counter);

  const prodPrice = renderElement('p', 'prod__price');
  const priceDiscount = getDiscountedPrice(prod.price, prod.discount, counts);
  const priceTotoal = getTotalPrice(prod.price, counts);

  if (prod.type === 'Sale%') {
    classManipulator(prodPrice, 'add', 'prod__price_sale');
    prodPrice.innerHTML = `<span>$${priceTotoal}</span> $${priceDiscount}`;
  } else {
    prodPrice.innerText = `$${priceTotoal}`;
  }

  const autoship = renderElement('div', 'prod__autoship');
  autoship.innerHTML = `
    <div class="prod__checkbox">
      <input type="checkbox" name="autoship" ${autoshipChecked ? 'checked' : ''} onclick="return ${prod.disabled_subscribe};"/>
      
      <span></span>
    </div>
    
    <p class="prod__autoship-text">Autoship every</p>
    
    <div class="dropdown">
      <div class="dropdown__box">
        <p class="dropdown__text">${autoshipDays}</p>
        
        <div class="dropdown__arrow">
          <svg>
            <use href="#back-arrow"></use>
          </svg>
        </div>
      </div>
      
      <div class="dropdown__list">
        <button class="dropdown__item">10</button>
        <button class="dropdown__item">20</button>
        <button class="dropdown__item">30</button>
        <button class="dropdown__item">40</button>
        <button class="dropdown__item">50</button>
        <button class="dropdown__item">60</button>
      </div>
    </div>
    
    days
  `;

  initDropdown(autoship);

  titleAndClose.appendChild(prodTitle);
  titleAndClose.appendChild(prodRmove);

  counterAndPrice.appendChild(counter);
  counterAndPrice.appendChild(prodPrice);

  prodInfo.appendChild(titleAndClose);
  prodInfo.appendChild(counterAndPrice);
  prodInfo.appendChild(autoship);

  prodCard.appendChild(prodImg);
  prodCard.appendChild(prodInfo);

  cartContainer.appendChild(prodCard);

  empty = false;
  emptyBag(empty);

  saveProductToLocalStorage(prod, autoshipChecked, autoshipDays, counts);

  removeProd(prod.id);

  updateInfoInLocal(prod);
}

function removeProd(prodId: number) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  const productExists = cartItems.some((item: Product) => item.id === prodId);

  if (!productExists) return;

  cartItems.forEach((prod: ProductLocalStorge) => {
    if (prod.id === prodId) {
      const prodEl = getElement(`.prod_${prod.id}`);
      if (!prodEl) return;

      const removeBtn = getElement('.prod__close', prodEl);

      if (!removeBtn) return;

      removeBtn.addEventListener('click', () => {
        prodEl.remove();
        removeProductFromLocalStorage(prodId);
      });
    }
  });
}

function removeProductFromLocalStorage(prodId: number) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  cartItems = cartItems.filter((item: Product) => item.id !== prodId);

  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  totalCartPrice();
  blockBtn();

  if (cartItems.length === 0) {
    const emptyText = getElement('.cart__empty');

    if (emptyText) return;

    empty = true;
    emptyBag(empty);
    totalCartPrice();
    return;
  }
}

export function getDiscountedPrice(price: string, discount: number, count: number): string {
  const originalPrice = parseFloat(price);
  if (isNaN(originalPrice)) {
    throw new Error('Invalid price format');
  }

  const unitPrice = Math.round(originalPrice * (1 - discount / 100) * 100) / 100;

  const totalPrice = Math.round(unitPrice * count * 100) / 100;

  return totalPrice.toFixed(2);
}

export function getTotalPrice(price: string, count: number): string {
  const originalPrice = parseFloat(price);

  if (isNaN(originalPrice)) {
    throw new Error('Invalid price format');
  }

  const totalPrice = originalPrice * count;

  return totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function saveProductToLocalStorage(prod: Product, autoshipChecked: boolean, autoshipDays: string, counts: number) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  const productExists = cartItems.some((item: Product) => item.id === prod.id);

  if (!productExists) {
    cartItems.push({
      id: prod.id,
      autoshipChecked: autoshipChecked,
      autoshipDays: autoshipDays,
      counts: counts,
    });
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

export function updateInfoInLocal(prod: Product) {
  const autoshipCheckbox = getElement<HTMLInputElement>(`.prod_${prod.id} .prod__checkbox input`);
  const autoshipDaysText = getElement(`.prod_${prod.id} .dropdown__text`);
  const autoshipDaysItem = getElements(`.prod_${prod.id} .dropdown__item`);
  const minusButton = getElement(`.prod_${prod.id} .counter__minus`);
  const plusButton = getElement(`.prod_${prod.id} .counter__plus`);
  const counterItems = getElement(`.prod_${prod.id} .counter__items`);

  if (!autoshipCheckbox || !autoshipDaysText || !autoshipDaysItem || !minusButton || !plusButton || !counterItems) return;

  if (autoshipCheckbox) {
    autoshipCheckbox.addEventListener('change', () => {
      updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, autoshipDaysText.textContent || '30', Number(counterItems.textContent));
      const checkAutoship = new CustomEvent('checkAutoship');
      document.dispatchEvent(checkAutoship);
    });
  }

  if (autoshipDaysText) {
    autoshipDaysItem.forEach((item) => {
      item.addEventListener('click', (event) => {
        const selectedDay = (event.target as HTMLElement).textContent || '30';
        updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, selectedDay, Number(counterItems.textContent));
      });
    });
  }

  minusButton.addEventListener('click', () => {
    updatePriceDisplay(prod, Number(counterItems.textContent));
    updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, autoshipDaysText.textContent || '30', Number(counterItems.textContent));

    totalCartPrice();
  });

  plusButton.addEventListener('click', () => {
    updatePriceDisplay(prod, Number(counterItems.textContent));
    updateAutoshipInLocalStorage(`${prod.id}`, autoshipCheckbox.checked, autoshipDaysText.textContent || '30', Number(counterItems.textContent));

    totalCartPrice();
  });
}

function updatePriceDisplay(prod: Product, count: number) {
  const priceDiscount = getDiscountedPrice(prod.price, prod.discount, count);
  const priceTotal = getTotalPrice(prod.price, count);
  const prodPrice = getElement(`.prod_${prod.id} .prod__price`);

  if (!prodPrice) return;

  if (prod.type === 'Sale%') {
    prodPrice.innerHTML = `<span>$${priceTotal}</span> $${priceDiscount}`;
    return;
  }

  prodPrice.innerText = `$${priceTotal}`;
}

export function updateAutoshipInLocalStorage(prodId: string, autoshipChecked: boolean, autoshipDays: string, counts: number) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  const productIndex = cartItems.findIndex((item: Product) => item.id === Number(prodId));

  if (productIndex !== -1) {
    cartItems[productIndex].autoshipChecked = autoshipChecked;
    cartItems[productIndex].autoshipDays = autoshipDays;
    cartItems[productIndex].counts = counts;
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

export function loadCartFromLocalStorage() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  if (cartItems.length === 0) {
    empty = true;
    emptyBag(empty);
    blockBtn();
    return;
  }

  empty = false;
  emptyBag(empty);
  blockBtn();
  if (!cartContainer) return;
  cartContainer.innerHTML = '';

  cartItems.forEach(async (prod: ProductLocalStorge) => {
    try {
      const prodItem = await getCatalogItem(`${prod.id}`);

      renderProdCard(prodItem, prod.autoshipChecked, prod.autoshipDays, prod.counts);
      updateInfoInLocal(prodItem);
    } catch (error) {
      console.error(error);
    }
  });
}

export function emptyBag(isEmpty: boolean) {
  const headerBag = getElement('.header__bag svg');

  if (!cartContainer || !cartBtn || !headerBag) return;
  if (!isEmpty) {
    const emptyText = getElements('.cart__empty');

    classManipulator(cartContainer, 'remove', 'empty');
    emptyText.forEach((el) => el.remove());

    cartBtn.style.display = '';

    headerBag.innerHTML = `<use href="#bag-active"></use>`;
  }

  if (isEmpty) {
    const empty = renderElement('p', 'cart__empty');
    empty.innerText = 'Your cart is empty';

    classManipulator(cartContainer, 'add', 'empty');
    cartBtn.style.display = 'none';

    cartContainer.appendChild(empty);

    headerBag.innerHTML = `<use href="#bag-active"></use>`;
  }
}

export function totalCartPrice() {
  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  let total: number = 0;
  let totalProdPrice: string;

  const totalPriceContent = getElement('#total-cart-price');

  if (!totalPriceContent) return;

  if (cartItems?.length === 0) {
    totalPriceContent.innerText = `$0`;
  }

  cartItems.forEach(async (item: ProductLocalStorge) => {
    try {
      const prodItem = await getCatalogItem(`${item.id}`);

      if (prodItem.type === 'Sale%') totalProdPrice = getDiscountedPrice(prodItem.price, prodItem.discount, item.counts);
      else totalProdPrice = getTotalPrice(prodItem.price, item.counts);

      total += parseFloat(totalProdPrice.replace(/,/g, '').replace(/\s/g, ''));

      totalPriceContent.innerText = `$${total.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

      limitTotalPrice(total);
    } catch (error) {
      console.error(error);
    }
  });
}

function limitTotalPrice(total: number) {
  const btnWrspper = getElement('.cart__btn');
  if (!btnWrspper) return;

  const btn = getElement('.btn', btnWrspper);
  if (!storedUserInfo || !btn) return;

  if (storedUserInfo.role_type === 'whosale') {
    btn.style.backgroundColor = '#C3BDB6';
    btn.style.pointerEvents = 'none';
    const limitInfo = renderElement('p', 'cart__limit');
    limitInfo.style.marginTop = '15px';
    limitInfo.style.textAlign = 'center';
    limitInfo.style.opacity = '0.5';
    limitInfo.style.fontSize = '14px';
    limitInfo.style.fontWeight = '400';
    limitInfo.innerText = 'Minimum order amount is $700';

    if (!getElement('.cart__limit')) {
      btnWrspper.appendChild(limitInfo);
    }

    if (total >= 700) {
      btn.style.backgroundColor = '';
      btn.style.pointerEvents = '';
    }
  }
}

export function blockBtn() {
  const btnWrspper = getElement('.cart__btn');
  if (!btnWrspper) return;

  const btn = getElement('.btn', btnWrspper);
  if (!btn) return;

  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  if (cartItems.length === 0) {
    btn.style.backgroundColor = '#C3BDB6';
    btn.style.pointerEvents = 'none';
    return;
  }

  btn.style.backgroundColor = '';
  btn.style.pointerEvents = '';
}
