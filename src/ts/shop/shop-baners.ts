import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { setImg } from '../components/set-img-size.ts';
import { getElement, getElements, renderElement } from '../composables/use-call-dom.ts';

export function shopBanners() {
  removeDuplicate();

  window.addEventListener('resize', () => {
    removeDuplicate();
  });

  setImg();

  new Swiper('.shop-baners__swiper', {
    modules: [Navigation, Pagination, Autoplay],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    autoplay: {
      delay: 5000,
    },
    loop: false,
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    breakpoints: {
      768: {
        slidesPerView: 'auto',
        spaceBetween: 35,
        loop: true,
      },
      1440: {
        slidesPerView: 'auto',
        spaceBetween: 50,
        loop: true,
      },
    },
  });
}

function removeDuplicate() {
  const swiperSlidesDuplicate = getElements('.shop-baners__swiper-slide-duplicate');
  const swiperWrapper = getElement('.shop-baners__swiper-wrapper');
  const screenWidth = window.innerWidth;

  if (screenWidth < 768) {
    swiperSlidesDuplicate.forEach((slide) => {
      slide.remove();
    });

    return;
  }

  if (screenWidth >= 768) {
    const swiperSlides = getElements('.swiper-slide .baner');
    if (!swiperSlides || !swiperWrapper || swiperSlidesDuplicate.length !== 0) return;

    swiperSlides.forEach((slide) => {
      const dubSlide = renderElement('div', ['shop-baners__swiper-slide', 'shop-baners__swiper-slide-duplicate', 'swiper-slide']);
      dubSlide.innerHTML = slide.innerHTML;

      swiperWrapper.appendChild(dubSlide);
    });
  }
}
