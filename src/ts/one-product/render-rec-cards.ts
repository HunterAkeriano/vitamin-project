import { renderRecCard } from '../components/render-card.ts';

export default async function render() {
  await renderRecCard('.you-like__cards', 'gray');
}