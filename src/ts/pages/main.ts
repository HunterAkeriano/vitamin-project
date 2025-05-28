import { initHeader } from '../components/header';
import { removeSkeletons } from '../components/remove-skeletons.ts';
import { stop } from '../components/stopPreload.ts';
import { lazyImg, LazyModule, useLoadFunction } from '../components/lazy-load.ts';
import { initCart } from '../components/cart/cart.ts';
import { renderCards } from '../home/render-cards-recommendations.ts';

const lazyModules: LazyModule[] = [
  {
    importFn: () => import('../home/recommendations-products-home-slider.ts'),
    selector: '.choose-products__products-slider',
  },
  {
    importFn: () => import('../components/feedback-slider.ts'),
    selector: '.feedback__slider',
  },
];

lazyModules.forEach(({ importFn, selector }) => useLoadFunction(importFn, selector));

document.addEventListener('DOMContentLoaded', async () => {
  await renderCards();
  initHeader();

  initCart();
  stop();
  lazyImg();
});

removeSkeletons();
