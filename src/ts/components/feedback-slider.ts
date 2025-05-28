import Swiper from 'swiper';

export default function feedbackSlider() {
  new Swiper('.feedback__slider', {
    speed: 400,
    spaceBetween: 10,
    slidesPerView: 1,
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      576: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
    },
  });
}
