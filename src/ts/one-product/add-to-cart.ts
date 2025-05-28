import { cartActive } from '../components/cart/cart.ts';
import { Product } from '../../typings/interfaces.ts';
import { getElement } from '../composables/use-call-dom.ts';
import { addBtn } from '../components/cart/cart-operation.ts';

const urlParams = new URLSearchParams(window.location.search);
const prodId = urlParams.get('id') || undefined;

const addProdBtn = getElement('.add-to-cart__btn');

export async function addToCartBtn(prod: Product) {
  if (!addProdBtn) return;

  if (prodId) {
    if (!addProdBtn) return;
    addProdBtn.addEventListener('click', (event) => {
      addBtn(prod);
      cartActive(event);
    });
  }
}
