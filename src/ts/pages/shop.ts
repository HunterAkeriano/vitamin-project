import { stop } from '../components/stopPreload.ts';
import { removeSkeletons } from '../components/remove-skeletons.ts';
import { lazyImg, LazyModule, useLoadFunction } from '../components/lazy-load.ts';
import { initCart } from '../components/cart/cart.ts';
import { initHeader } from '../components/header.ts';
import { shopBanners } from '../shop/shop-baners.ts';

document.addEventListener('DOMContentLoaded', async () => {
  const lazyModules: LazyModule[] = [
    {
      importFn: () => import('../components/feedback-slider.ts'),
      selector: '.feedback__slider',
    },
    {
      importFn: () => import('../shop/shop-filter'),
      selector: '.catalog-list__content',
    },
    {
      importFn: () => import('../shop/filter-dropdown'),
      selector: '.catalog__content',
    },
  ];

  lazyModules.forEach(({ importFn, selector }) => useLoadFunction(importFn, selector));

  initCart();
  shopBanners();
  initHeader();
  lazyImg();
  stop();
});

removeSkeletons();
