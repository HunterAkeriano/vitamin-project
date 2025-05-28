import { classManipulator, getElement, renderElement } from '../composables/use-call-dom.ts';
import { ProductLocalStorge } from '../../typings/interfaces.ts';
import { getCatalogItem } from '../composables/use-api.ts';
import { getTotalPrice, getDiscountedPrice } from '../components/cart/render-cart.ts';

const orderListCintainer = getElement('.order-list__prods-container');
const orderListPrice = getElement('.order-list__total');

export default function createOrderList() {
  loadCards();
  totalCartPrice();
}

function loadCards() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  if (cartItems.length === 0) {
    return;
  }

  if (!orderListCintainer) return;
  orderListCintainer.innerHTML = '';

  cartItems.forEach(async (prod: ProductLocalStorge) => {
    await renderProd(prod);
  });
}

async function renderProd(prod: ProductLocalStorge) {
  if (!orderListCintainer) return;

  const prodContent = renderElement('div', ['prod', `prod_${prod.id}`]);

  const prodImg = renderElement('div', 'prod__img');

  try {
    const prodItem = await getCatalogItem(`${prod.id}`);

    if (prodItem.type === 'Vitamins & Dietary Supplements') {
      classManipulator(prodImg, 'add', 'prod__img_purple');
    }
    if (prodItem.type === 'Minerals') {
      classManipulator(prodImg, 'add', 'prod__img_green-mint');
    }
    if (prodItem.type === 'Prenatal Vitamins') {
      classManipulator(prodImg, 'add', 'prod__img_pink');
    }
    if (prodItem.type === 'Pain Relief') {
      classManipulator(prodImg, 'add', 'prod__img_blue');
    }
    if (prodItem.type === 'Antioxidants') {
      classManipulator(prodImg, 'add', 'prod__img_orange');
    }
    if (prodItem.type === 'Weight Loss') {
      classManipulator(prodImg, 'add', 'prod__img_dark-blue');
    }
    if (prodItem.type === 'Probiotics' || prodItem.type === 'Sale%') {
      classManipulator(prodImg, 'add', 'prod__img_red');
    }

    prodImg.innerHTML = `
        <picture>
           <source srcset="${prodItem.img.img_webp}" type="image/webp">
           <img src="${prodItem.img.img_default}" alt="prod" width="${prodItem.img.img_width}" height="${prodItem.img.img_height}" />
        </picture>`;

    const prodCountAndName = renderElement('div', 'prod__count-and-name');
    prodCountAndName.innerText = `${prod.counts} x ${prodItem.name}`;

    const prodPrice = renderElement('p', 'prod__price');
    const priceDiscount = getDiscountedPrice(prodItem.price, prodItem.discount, prod.counts);
    const priceTotoal = getTotalPrice(prodItem.price, prod.counts);

    if (prodItem.type === 'Sale%') {
      classManipulator(prodPrice, 'add', 'prod__price_sale');
      prodPrice.innerHTML = `<span>$${priceTotoal}</span> $${priceDiscount}`;
    } else {
      prodPrice.innerText = `$${priceTotoal}`;
    }

    prodContent.appendChild(prodImg);
    prodContent.appendChild(prodCountAndName);
    prodContent.appendChild(prodPrice);

    orderListCintainer.appendChild(prodContent);
  } catch (error) {
    console.error(error);
  }
}

async function totalCartPrice() {
  if (!orderListPrice) return;

  let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

  let total: number = 0;
  let totalProdPrice: number;
  let discount: number = 0;

  const subtotalPrice = renderElement('p', 'order-list__subtotal');
  const shoppingPrice = renderElement('p', 'order-list__shopping');
  const discountPrice = renderElement('p', 'order-list__discount');
  const totalPrice = renderElement('p', 'order-list__todays-total');
  const accordionTotalPrice = getElement('.accordion__price');

  if (cartItems?.length === 0) {
    totalPrice.innerHTML = `Today’s Total: <span>$0</span>`;
  }

  try {
    for (const item of cartItems) {
      const prodItem = await getCatalogItem(`${item.id}`);

      if (prodItem.type === 'Sale%') {
        totalProdPrice = parseFloat(getTotalPrice(prodItem.price, item.counts).replace(/,/g, '').replace(/\s/g, ''));

        const discountedPrice = parseFloat(getDiscountedPrice(prodItem.price, prodItem.discount, item.counts).replace(/,/g, '').replace(/\s/g, ''));

        discount += totalProdPrice - discountedPrice;

        total += Math.round(totalProdPrice * 100) / 100;
      } else {
        totalProdPrice = parseFloat(getTotalPrice(prodItem.price, item.counts).replace(/,/g, '').replace(/\s/g, ''));

        total += Math.round(totalProdPrice * 100) / 100;
      }
    }

    subtotalPrice.innerHTML = `Subtotal <span>$${total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</span>`;

    orderListPrice.appendChild(subtotalPrice);

    if (discount !== 0) {
      discountPrice.innerHTML = `Discount <span class="red">-$${discount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</span>`;

      orderListPrice.appendChild(discountPrice);

      total -= discount;
    }

    shoppingPrice.innerHTML = 'Shipping <span>$9.20</span>';
    orderListPrice.appendChild(shoppingPrice);

    total += 9.2;

    totalPrice.innerHTML = `Today’s Total: <span>$${total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</span>`;

    orderListPrice.appendChild(totalPrice);

    if (!accordionTotalPrice) return;

    accordionTotalPrice.innerText = `$${total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } catch (error) {
    console.error(error);
  }
}
