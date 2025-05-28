import { getElements } from '../composables/use-call-dom.ts';

export function renderUserName() {
  const headerUserName = getElements('.header__user-name');
  const storedUserInfo = localStorage.getItem('userInfo');
  if (headerUserName && storedUserInfo) {
    const userInfo = JSON.parse(storedUserInfo);
    headerUserName.forEach((item: Element) => {
      const spanItem = item;
      if (!(spanItem instanceof HTMLSpanElement)) return;
      spanItem.innerText = `${userInfo.first_name} ${userInfo.last_name}`;
    });
  }
}
