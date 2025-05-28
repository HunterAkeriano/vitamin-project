import { initHeader } from '../components/header';
import { stop } from '../components/stopPreload.ts';
import { removeSkeletons } from '../components/remove-skeletons.ts';
import { lazyImg, LazyModule, useLoadFunction } from '../components/lazy-load.ts';
import { initCart } from '../components/cart/cart.ts';

document.addEventListener('DOMContentLoaded', async () => {
  const lazyModules: LazyModule[] = [
    {
      importFn: () => import('../one-product/load-info'),
      selector: '.ilustrate',
    },
    {
      importFn: () => import('../one-product/render-rec-cards'),
      selector: '.you-like',
    },
  ];

  lazyModules.forEach(({ importFn, selector }) => useLoadFunction(importFn, selector));

  initHeader();
  initCart();
  lazyImg();
  stop();
});

removeSkeletons();
