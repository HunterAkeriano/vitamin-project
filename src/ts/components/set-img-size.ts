import { getElements } from '../composables/use-call-dom.ts';

async function getImageSize(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

async function setImageSize(imgElement: HTMLImageElement): Promise<void> {
  if (!imgElement.src) return;
  try {
    const { width, height } = await getImageSize(imgElement.src);
    imgElement.setAttribute('width', width.toString());
    imgElement.setAttribute('height', height.toString());
  } catch (error) {
    console.error('Error loading image:', error);
  }
}

export function setImg() {
  getElements<HTMLImageElement>('img').forEach((img) => setImageSize(img));
}
