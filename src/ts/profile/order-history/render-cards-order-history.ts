import { getOrderHistory } from '../../composables/use-api.ts';
import { OrdersData } from '../../../typings/interfaces.ts';
import { getColorCard } from './get-color.ts';
import { cartActive } from '../../components/cart/cart.ts';
import { getElement, renderElement } from '../../composables/use-call-dom.ts';
import { addAllToCartOrders } from '../../components/cart/cart-operation.ts';

export async function renderCardsOrderHistory() {
  const res = await getOrderHistory();

  if ('errors' in res) {
    return;
  }

  const ordersData: OrdersData = res;

  const orderHistoryContainer = getElement<HTMLElement>('#orderItems');
  if (!orderHistoryContainer) {
    console.error('Container not found');
    return;
  }
  orderHistoryContainer.innerHTML = '';

  ordersData.orders.forEach((orderItem) => {
    const productsIdAndCounts: { id: string; counts: number }[] = [];

    const orderItemContainer = renderElement<HTMLElement>('article', 'orderItem');

    const orderItemContainerHeader = renderElement<HTMLElement>('div', 'orderItem__header');
    const orderItemContainerHeaderData = renderElement<HTMLElement>('div', 'orderItem__data');

    const date = new Date(orderItem.date_created);
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const iconRow = renderElement<HTMLImageElement>('svg', 'orderItem__icon');
    iconRow.innerHTML = '<svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
      '  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.01714e-05 7.53624L1.44501 9L7.43948 2.92751L13.434 9L14.8789 7.53624L7.43948 8.87142e-08L6.01714e-05 7.53624Z" fill="black" />\n' +
      '</svg>'


    const orderItemDate = renderElement<HTMLElement>('div', 'orderItem__date');
    orderItemDate.innerText = formattedDate;

    const orderItemId = renderElement<HTMLElement>('div', 'orderItem__id');
    orderItemId.innerText = `No ${orderItem.order_number}`;

    const orderItemContainerDescription = renderElement<HTMLElement>('div', 'orderItem__description');
    orderItemContainerDescription.innerText = 'Shipping';

    orderItemContainerHeaderData.appendChild(orderItemDate);
    orderItemContainerHeader.appendChild(orderItemContainerHeaderData);
    orderItemContainerHeaderData.appendChild(orderItemContainerDescription);
    orderItemContainer.appendChild(orderItemContainerHeader);
    orderItemContainerHeader.appendChild(iconRow);
    orderItemContainerHeader.appendChild(orderItemId);

    const orderItemBody = renderElement<HTMLElement>('div', 'orderItem__body');

    orderItem.items.forEach((item) => {
      productsIdAndCounts.push({
        id: item.product.id,
        counts: item.quantity,
      });

      const card = renderElement<HTMLAnchorElement>('a', ['orderItem__card', 'card']);
      card.href = `/one-product.html?id=${item.product.id}`;

      const imgBlock = renderElement<HTMLElement>('div', ['card__img-block', getColorCard(item.product.type, 'card__img-block')]);

      const imgWrapper = renderElement<HTMLElement>('div', 'card__img-wrapper');
      const picture = renderElement<HTMLElement>('picture', null);

      const source = renderElement<HTMLElement>('source', null);
      source.setAttribute('srcset', item.product.img.img_webp);
      source.setAttribute('type', 'image/webp');

      const img = renderElement<HTMLImageElement>('img', 'card__img');
      img.src = item.product.img.img_default;
      img.alt = 'prod';
      img.width = parseFloat(item.product.img.img_width);
      img.height = parseFloat(item.product.img.img_height);
      img.loading = 'lazy';

      picture.appendChild(source);
      picture.appendChild(img);
      imgWrapper.appendChild(picture);
      imgBlock.appendChild(imgWrapper);

      const cardBody = renderElement<HTMLElement>('div', 'card__body');

      const cardType = renderElement<HTMLElement>('div', ['card__type', getColorCard(item.product.type, 'card__type')]);
      cardType.innerText = item.product.type;

      const cardName = renderElement<HTMLElement>('div', null);
      cardName.innerText = `${item.quantity} х ${item.product.name}`;

      const cardPrice = renderElement<HTMLElement>('div', 'card__price');
      const formattedPrice = item.total_sum.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      cardPrice.innerText = formattedPrice;

      cardBody.appendChild(cardType);
      cardBody.appendChild(cardName);
      cardBody.appendChild(cardPrice);
      card.appendChild(imgBlock);
      card.appendChild(cardBody);
      orderItemBody.appendChild(card);
    });

    const orderItemContent = renderElement<HTMLElement>('div', 'orderItem__content');
    orderItemContent.appendChild(orderItemBody);

    const orderItemFooter = renderElement<HTMLElement>('div', 'orderItem__footer');

    const orderItemTotal = renderElement<HTMLElement>('div', 'orderItem__total');
    orderItemTotal.innerHTML = `<span class="orderItem__total-text">Order amount:</span> <span class="orderItem__total-sum">${parseFloat(orderItem.total_sum_order).toFixed(2)}</span>`;

    const orderItemButton = renderElement<HTMLButtonElement>('button', ['orderItem__button', 'btn', 'btn_orange']);
    orderItemButton.innerText = 'Add to cart';

    orderItemButton.addEventListener('click', async (event) => {
      await addAllToCartOrders(productsIdAndCounts);
      cartActive(event);
    });

    orderItemFooter.appendChild(orderItemTotal);
    orderItemFooter.appendChild(orderItemButton);
    orderItemContent.appendChild(orderItemFooter);
    orderItemContainer.appendChild(orderItemContent);

    orderHistoryContainer.appendChild(orderItemContainer);
  });

  return Promise.resolve();
}
