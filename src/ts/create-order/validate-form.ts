import JustValidate from 'just-validate';
import { getElement } from '../composables/use-call-dom.ts';

export function validateOrderInfo(): Promise<boolean> {
  return new Promise((resolve) => {
    const form = getElement('#create-order') as HTMLFormElement;
    if (!form) return;

    const validator = new JustValidate(form, {
      errorLabelStyle: {
        color: '#ff7d4e',
      },
      focusInvalidField: true,
      lockForm: false,
      validateBeforeSubmitting: true,
    });

    validator
      .addField('#first-name', [
        {
          rule: 'required',
          errorMessage: 'This field is required',
        },
        {
          rule: 'minLength',
          value: 2,
          errorMessage: 'Must be at least 2 characters',
        },
        {
          rule: 'maxLength',
          value: 50,
          errorMessage: 'Must be less than 50 characters',
        },
        {
          rule: 'customRegexp',
          value: /^[\p{L}]+$/u,
          errorMessage: 'Only letters are allowed',
        },
      ])
      .addField('#last-name', [
        {
          rule: 'required',
          errorMessage: 'This field is required',
        },
        {
          rule: 'minLength',
          value: 2,
          errorMessage: 'Must be at least 2 characters',
        },
        {
          rule: 'maxLength',
          value: 50,
          errorMessage: 'Must be less than 50 characters',
        },
        {
          rule: 'customRegexp',
          value: /^[\p{L}]+$/u,
          errorMessage: 'Only letters are allowed',
        },
      ])
      .addField('#address-line1', [
        {
          rule: 'required',
          errorMessage: 'This field is required',
        },
        {
          rule: 'minLength',
          value: 5,
          errorMessage: 'Must be at least 5 characters',
        },
        {
          rule: 'maxLength',
          value: 50,
          errorMessage: 'Must be less than 50 characters',
        },
        {
          rule: 'customRegexp',
          value: /^[\p{L}\d.,\s]+$/u,
          errorMessage: 'Write correct address',
        },
      ])
      .addField('#address-line2', [
        {
          rule: 'minLength',
          value: 5,
          errorMessage: 'Must be at least 5 characters',
        },
        {
          rule: 'maxLength',
          value: 50,
          errorMessage: 'Must be less than 50 characters',
        },
        {
          rule: 'customRegexp',
          value: /^[\p{L}\d.,\s]+$/u,
          errorMessage: 'Write correct address',
        },
      ])
      .addField('#city', [
        {
          rule: 'required',
          errorMessage: 'This field is required',
        },
        {
          rule: 'minLength',
          value: 2,
          errorMessage: 'Must be at least 2 characters',
        },
        {
          rule: 'maxLength',
          value: 50,
          errorMessage: 'Must be less than 50 characters',
        },
        {
          rule: 'customRegexp',
          value: /^[\p{L}]+$/u,
          errorMessage: 'Enter a valid city name',
        },
      ])
      .addField('#state', [
        {
          rule: 'required',
          errorMessage: 'This field is required',
        },
      ])
      .addField('#zip', [
        {
          rule: 'required',
          errorMessage: 'This field is required',
        },
        {
          rule: 'minLength',
          value: 3,
          errorMessage: 'Must be at least 3 characters',
        },
        {
          rule: 'maxLength',
          value: 10,
          errorMessage: 'Must be less than 10 characters',
        },
        {
          rule: 'customRegexp',
          value: /^\d+$/,
          errorMessage: 'Enter a valid ZIP / Postal Code',
        },
      ])
      .addField('#mail', [
        {
          rule: 'required',
          errorMessage: 'This field is required',
        },
        {
          rule: 'customRegexp',
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})$/,
          errorMessage: 'Write correct email',
        },
      ])
      .addField('#phone', [
        {
          rule: 'required',
          errorMessage: 'This field is required',
        },
        {
          rule: 'custom',
          validator: (value: string) => {
            const startsWith = [
              { mask: '+{1} (000) 000-0000', startsWith: '1' }, // США/Канада
              { mask: '+{7} (000) 000-00-00', startsWith: '7' }, // Россия/Казахстан
              { mask: '+{380} (00) 000-00-00', startsWith: '380' }, // Украина
              { mask: '+{44} (0000) 000000', startsWith: '44' }, // Великобритания
              { mask: '+{49} (000) 000-0000', startsWith: '49' }, // Германия
              { mask: '+{86} (000) 0000-0000', startsWith: '86' }, // Китай
              { mask: '+{33} (0) 0 00 00 00 00', startsWith: '33' }, // Франция
              { mask: '+{39} 0 000 000 000', startsWith: '39' }, // Италия
              { mask: '+{34} 000 000 000', startsWith: '34' }, // Испания
              { mask: '+{61} (0) 0000 0000', startsWith: '61' }, // Австралия
              { mask: '+{81} (0) 0-0000-0000', startsWith: '81' }, // Япония
              { mask: '+{91} 0000 000 000', startsWith: '91' }, // Индия
              { mask: '+{52} (0) 000 0000 0000', startsWith: '52' }, // Мексика
              { mask: '+{55} (0) 00 0000-0000', startsWith: '55' }, // Бразилия
              { mask: '+{82} (0) 0-0000-0000', startsWith: '82' }, // Южная Корея
              { mask: '+{90} 000 000 00 00', startsWith: '90' }, // Турция
              { mask: '+{27} 000 000 000', startsWith: '27' }, // Южноафриканская Республика
              { mask: '+{64} 0 000 000 000', startsWith: '64' }, // Новая Зеландия
              { mask: '+{65} 0000 0000', startsWith: '65' }, // Сингапур
              { mask: '+{48} 000 000 000', startsWith: '48' }, // Польша
            ];

            // Проверяем, начинается ли введенный номер с подходящих цифр
            const cleanedValue = value.replace(/\D/g, ''); // Убираем все нецифровые символы

            return startsWith.some((mask) => cleanedValue.startsWith(mask.startsWith));
          },
          errorMessage: 'The number must start with one of the valid country codes.',
        },
      ])
      .addField('#card', [
        {
          rule: 'required',
          errorMessage: 'This field is required',
        },
        {
          rule: 'minLength',
          value: 19,
          errorMessage: 'Must be at least 16 characters',
        },
      ])
      .addField('#expiration', [
        {
          rule: 'required',
          errorMessage: 'This field is required',
        },
        {
          rule: 'minLength',
          value: 5,
          errorMessage: 'Must be at least 4 characters',
        },
      ])
      .addField('#cvc', [
        {
          rule: 'required',
          errorMessage: 'This field is required',
        },
        {
          rule: 'minLength',
          value: 3,
          errorMessage: 'Must be at least 3 characters',
        },
      ]);

    validator.validate();
    validator.onSuccess(() => resolve(true));
    validator.onFail(() => resolve(false));
  });
}
