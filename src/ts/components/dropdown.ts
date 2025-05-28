import { classManipulator, getElement, getElements } from '../composables/use-call-dom.ts';

export function initDropdown(el: HTMLElement) {
  const dropdown = getElement('.dropdown', el);
  const dropdownBox = getElement('.dropdown__box', el);
  const dropdownActiveItem = getElement('.dropdown__text', el);
  const dropdownList = getElement('.dropdown__list', el);
  const dropdownItems = getElements('.dropdown__item', el);

  if (!dropdown || !dropdownBox || !dropdownActiveItem || !dropdownList || !dropdownItems) return;

  dropdown.addEventListener('click', (event) => toggleDropdown(event, dropdownBox, dropdownList));

  dropdownItems.forEach((item) => {
    item.addEventListener('click', () => onItemClick(item, dropdownActiveItem, dropdownBox, dropdownList));
  });

  document.addEventListener('click', (event) => handleOutsideClick(event, dropdown, dropdownList, dropdownBox));
}

function toggleDropdown(event: Event, dropdownBox: HTMLElement, dropdownList: HTMLElement) {
  event.stopPropagation();

  if (!dropdownBox) return;
  dropdownBox.classList.toggle('dropdown__box_active');

  if (!dropdownList) return;
  dropdownList.classList.toggle('dropdown__list_active');
}

function closeDropdown(dropdownBox: HTMLElement, dropdownList: HTMLElement) {
  if (!dropdownBox) return;
  classManipulator(dropdownBox, 'remove', 'dropdown__box_active');

  if (!dropdownList) return;
  classManipulator(dropdownList, 'remove', 'dropdown__list_active');
}

function onItemClick(item: HTMLElement, dropdownActiveItem: HTMLElement, dropdownBox: HTMLElement, dropdownList: HTMLElement) {
  const selectedValue = item.textContent;
  if (!selectedValue) return;

  if (!dropdownActiveItem) return;

  if (dropdownActiveItem.tagName.toLowerCase() === 'p') dropdownActiveItem.textContent = selectedValue;
  if (dropdownActiveItem.tagName.toLowerCase() === 'input') {
    (dropdownActiveItem as HTMLInputElement).value = selectedValue;
    const hiddenInput = getElement('#state-hidden') as HTMLInputElement;

    if(!hiddenInput) return;
    hiddenInput.value = selectedValue;
  }

  toggleDropdown(event as Event, dropdownBox, dropdownList);
}

function handleOutsideClick(event: MouseEvent, dropdown: HTMLElement, dropdownList: HTMLElement, dropdownBox: HTMLElement) {
  if (dropdown && dropdownList)
    if (!dropdown.contains(event.target as Node) && !dropdownList.contains(event.target as Node)) {
      closeDropdown(dropdownBox, dropdownList);
    }
}
