import { classManipulator, getElement, getElements, renderElement } from '../../composables/use-call-dom.ts';
import { loadCartFromLocalStorage, totalCartPrice } from './render-cart.ts';
import { Product } from '../../../typings/interfaces.ts';

const cartBtn = getElement('.header__bag');
const cart = getElement('.cart');
const cartCloseBtn = getElement('.cart__close');
const cartBg = getElement('.cart__bg');
const cartContainer = getElement('.cart__items');
const header = getElement('.header');
const html = getElement('html');

let prodList = getElements('.prod');
let scrollPosition = 0;
let isCartOpened: boolean = false;

const backToShopBtn = getElement('.info__backbtn');

export function initCart() {
  if (!cartBtn || !cartCloseBtn || !cartBg || !cartContainer) return;

  cartBtn.addEventListener('click', (event) => cartActive(event));

  cartCloseBtn.addEventListener('click', () => cartClose());
  cartBg.addEventListener('click', () => cartClose());

  changeAutoship();
}

export function cartActive(event: Event) {
  event.stopPropagation();

  if (!cart) return;

  classManipulator(cart, 'add', 'cart_active');

  if (!isCartOpened) {
    isCartOpened = true;

    loadCartFromLocalStorage();
    totalCartPrice();

    prodList.forEach((prod) => {
      const prodAutoshipText = getElement('.prod__autoship-text', prod);

      if (!prodAutoshipText) return;

      changeAutoshipText(prodAutoshipText);
    });
  }

  if (backToShopBtn) backToShopBtn.style.zIndex = '1';

  scrollLock();
}

function cartClose() {
  if (!cart) return;

  classManipulator(cart, 'remove', 'cart_active');

  if (backToShopBtn) backToShopBtn.style.zIndex = '25';

  scrollLock();
}

function scrollLock() {
  if (!header || !html || !cart || !cartContainer) return;

  if (cart.classList.contains('cart_active')) {
    scrollPosition = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = '0';
    document.body.style.width = '100%';

    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.backgroundColor = 'white';

    const scrollbarWidth = getScrollbarWidthAlternative();
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    header.style.paddingRight = `${scrollbarWidth}px`;

    return;
  }

  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.width = '';
  document.body.style.paddingRight = '';

  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo({ top: scrollPosition, behavior: 'instant' });
  document.documentElement.style.scrollBehavior = '';

  header.style.top = '';
  header.style.left = '';
  header.style.position = '';
  header.style.backgroundColor = '';

  header.style.paddingRight = '0';
}

function getScrollbarWidthAlternative(): number {
  const div = renderElement('div', '');

  div.style.width = '100px';
  div.style.height = '100px';
  div.style.overflow = 'scroll';
  div.style.position = 'absolute';
  div.style.top = '-9999px';

  document.body.appendChild(div);

  const scrollbarWidth = div.offsetWidth - div.clientWidth;

  document.body.removeChild(div);

  return scrollbarWidth;
}

function changeAutoshipText(textEl: HTMLElement) {
  if (window.innerWidth < 768) {
    textEl.innerText = 'Deliver every';
  }
}

function changeAutoship() {
  const urlParams = new URLSearchParams(window.location.search);
  const prodId = urlParams.get('id');
  const autoshipProd = getElement('.autoship__on-off');
  const autoshipProdCircle = getElement('.autoship__circle');

  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  if (!prodId) return;

  const productIndex = cartItems.findIndex((item: Product) => item.id === Number(prodId));

  if (!cartItems[productIndex]) return;

  if (cartItems[productIndex].autoshipChecked) {
    console.log(cartItems[productIndex].autoshipChecked);
    autoshipProd?.classList.toggle('autoship__on-off_active');
    autoshipProdCircle?.classList.toggle('autoship__circle_active');
  }

  document.addEventListener('checkAutoship', () => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const productIndex = cartItems.findIndex((item: Product) => item.id === Number(prodId));

    if (cartItems[productIndex].autoshipChecked == true) {
      autoshipProd?.classList.add('autoship__on-off_active');
      autoshipProdCircle?.classList.add('autoship__circle_active');
      return;
    }

    autoshipProd?.classList.remove('autoship__on-off_active');
    autoshipProdCircle?.classList.remove('autoship__circle_active');
  });
}
