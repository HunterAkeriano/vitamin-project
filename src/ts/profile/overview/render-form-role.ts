import { UserInfo } from '../interfaces.ts';
import { getProfileInfo } from '../../composables/use-api.ts';
import { classManipulator, getElement } from '../../composables/use-call-dom.ts';

export async function renderFormRole() {
  const res = await getProfileInfo();
  if (!('errors' in res)) {
    localStorage.setItem('userInfo', JSON.stringify(res));
  }

  const userData = localStorage.getItem('userInfo');
  if (!userData) return;

  const userInfo: UserInfo = JSON.parse(userData);

  const userRoleContainer = getElement('.overview__role');
  if (userRoleContainer instanceof HTMLDivElement) {
    userRoleContainer.innerText = `${userInfo.role_type.charAt(0).toUpperCase() + userInfo.role_type.slice(1).toLowerCase()} customer`;
  }

  if (userInfo.role_type !== 'regular') {
    const fieldWrapper = getElement('.overview-form__field-wrapper');
    if (fieldWrapper instanceof HTMLElement) {
      classManipulator(fieldWrapper, 'remove', 'overview-form__field-wrapper_hidden');
    }
  }

  const fields: { inputId: string; key: keyof UserInfo }[] = [
    { inputId: 'first_name', key: 'first_name' },
    { inputId: 'last_name', key: 'last_name' },
    { inputId: 'address_one', key: 'address_one' },
    { inputId: 'address_two', key: 'address_two' },
    { inputId: 'city', key: 'city' },
    { inputId: 'email', key: 'email' },
    { inputId: 'phone', key: 'phone' },
    { inputId: 'postal_code', key: 'postal_code' },
    { inputId: 'overview-state', key: 'state_province' },
  ];

  fields.forEach((field) => {
    const input = document.getElementById(field.inputId);
    if (input instanceof HTMLInputElement) {
      input.value = (userInfo[field.key] as string) || '';
    }
  });

  const form = document.getElementById('overview-form');
  if (userInfo.state_province && form instanceof HTMLFormElement) {
    const select = getElement('.select-selected', form);
    if (select instanceof HTMLElement) {
      select.textContent = userInfo.state_province;
    }
  }
}
