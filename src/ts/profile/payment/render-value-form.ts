import { CardInfo, UserInfo } from '../interfaces.ts';

export function renderValueForm() {
  const userData = localStorage.getItem('userInfo');

  if (!userData) return;

  const userInfo: UserInfo = JSON.parse(userData);

  const fields: { inputId: string; key: keyof CardInfo }[] = [
    { inputId: 'card_number', key: 'card_number' },
    { inputId: 'card_date', key: 'card_date' },
    { inputId: 'card_cvv', key: 'card_cvv' },
  ];

  fields.forEach((field) => {
    const input = document.getElementById(field.inputId);
    if (input instanceof HTMLInputElement && userInfo.card_info) {
      input.value = userInfo.card_info[field.key];
    }
  });
}
