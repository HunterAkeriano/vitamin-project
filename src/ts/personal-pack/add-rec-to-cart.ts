import { getElement, getElements } from '../composables/use-call-dom.ts';
import { cartActive } from '../components/cart/cart.ts';
import { addAllToCart } from '../components/cart/cart-operation.ts';

const addAllProdBtn = getElement('.your-pack__continue');

export function addRecToCart() {
  const cardsItems = getElements('.prod-card');

  if (!addAllProdBtn || !cardsItems) return;

  const cardsId = Array.from(cardsItems).map((card) => card.classList[1]);

  addAllProdBtn.addEventListener('click', async (event) => {
    await addAllToCart(cardsId);
    cartActive(event);
  });
}
