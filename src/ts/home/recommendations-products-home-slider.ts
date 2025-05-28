import Swiper from 'swiper';
import 'swiper/css';

export default function recommendationsProductsSlider(): void {
  new Swiper('.choose-products__products-slider', {
    speed: 500,
    slidesPerView: 'auto',
    loop: true,
    breakpoints: {

    },
  });
}
