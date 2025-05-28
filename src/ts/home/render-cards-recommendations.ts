import { getRecommendations } from '../composables/use-api.ts';
import { getElement, renderElement } from '../composables/use-call-dom.ts';

interface ImageData {
  img_webp: string;
  img_default: string;
  img_width: string;
  img_height: string;
}

interface ProductItem {
  type: string;
  name: string;
  description: string;
  img: ImageData;
}

export async function renderCards(): Promise<void> {
  const response = await getRecommendations(false);
  const container: HTMLElement | null = getElement('#choose-products-slider');

  if ('errors' in response || !response.data) {
    console.error('API response contains errors or no data:', response.errors);
    return;
  }

  if (!container) {
    console.error('Container with ID "choose-products-slider" not found.');
    return;
  }

  container.innerHTML = '';

  const fragment: DocumentFragment = document.createDocumentFragment();

  response.data.forEach((item: ProductItem) => {
    const card = renderElement<HTMLDivElement>('div', ['swiper-slide', 'choose-products__slide', getColorCard(item.type), 'skeleton']);

    const imgWrapper = renderElement<HTMLDivElement>('div', 'choose-products__img-wrapper');

    const pictureElement = renderElement<HTMLPictureElement>('picture', null);

    const source = renderElement<HTMLSourceElement>('source', null);
    source.setAttribute('srcset', item.img.img_webp);
    source.setAttribute('type', 'image/webp');

    const imgElement = renderElement<HTMLImageElement>('img', 'choose-products__img');
    imgElement.src = item.img.img_default;
    imgElement.alt = 'prod';
    imgElement.width = parseFloat(item.img.img_width);
    imgElement.height = parseFloat(item.img.img_height);
    imgElement.loading = 'lazy';

    pictureElement.appendChild(source);
    pictureElement.appendChild(imgElement);
    imgWrapper.appendChild(pictureElement);
    card.appendChild(imgWrapper);

    const descriptionBlock = renderElement<HTMLDivElement>('div', 'choose-products__description-block');

    const typeElement = renderElement<HTMLDivElement>('div', 'choose-products__type');
    typeElement.textContent = item.type;
    descriptionBlock.appendChild(typeElement);

    const titleElement = renderElement<HTMLDivElement>('div', 'choose-products__product-title');
    titleElement.textContent = item.name;
    descriptionBlock.appendChild(titleElement);

    const descriptionElement = renderElement<HTMLDivElement>('div', 'choose-products__product-description');
    descriptionElement.textContent = item.description;
    descriptionBlock.appendChild(descriptionElement);

    card.appendChild(descriptionBlock);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

function getColorCard(type: string): string {
  let result: string;
  switch (type) {
    case 'Probiotics':
      result = 'redBg';
      break;
    case 'Weight Loss':
      result = 'darkBlueBg';
      break;
    case 'Antioxidants':
      result = 'orangeBg';
      break;
    case 'Pain Relief':
      result = 'blueBg';
      break;
    case 'Prenatal Vitamins':
      result = 'pinkBg';
      break;
    case 'Minerals':
      result = 'greenMintBg';
      break;
    case 'Vitamins & Dietary Supplements':
      result = 'purpleBg';
      break;
    default:
      result = 'redBg';
  }
  return `choose-products__slide_${result}`;
}
