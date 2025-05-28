import JustValidate from 'just-validate';
import { overviewRequest } from './overview-request.ts';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { getElement } from '../../composables/use-call-dom.ts';

export let validation: any;

export function overviewValidate() {
  interface FormData {
    first_name: string;
    last_name: string;
    address_one: string;
    address_two: string;
    city: string;
    state_province: string;
    postal_code: string;
    email: string;
    phone: string;
  }

  const form = getElement<HTMLFormElement>('#overview-form');
  if (!form) return;

  validation = new JustValidate(form);

  validation
    .addField('#first_name', [
      {
        rule: 'required',
        errorMessage: 'First Name is required',
      },
    ])
    .addField('#last_name', [
      {
        rule: 'required',
        errorMessage: 'Last Name is required',
      },
    ])
    .addField('#address_one', [
      {
        rule: 'required',
        errorMessage: 'Address line 1 is required',
      },
    ])
    .addField('#address_two', [
      {
        rule: 'required',
        errorMessage: 'Address line 2 is required',
      },
    ])
    .addField('#city', [
      {
        rule: 'required',
        errorMessage: 'City is required',
      },
    ])
    .addField('#postal_code', [
      {
        rule: 'required',
        errorMessage: 'ZIP / Postal code is required',
      },
      {
        rule: 'number',
        errorMessage: 'Postal code only number',
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Email is required',
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid',
      },
    ])
    .addField('#phone', [
      {
        rule: 'required',
        errorMessage: 'Phone Number is required',
      },
      {
        rule: 'customRegexp',
        value: /^\+38 \(\d{3}\)\d{3}-\d{2}-\d{2}$/,
        errorMessage: 'Phone Number must be in the format +38 (XXX)XXX-XX-XX',
      },
    ])
    .addField('#overview-state', [
      {
        rule: 'required',
        errorMessage: 'State is required',
      },
    ])
    .onSuccess(() => {
      // Получаем элементы ввода с правильными типами
      const firstNameInput = getElement<HTMLInputElement>('#first_name', form);
      const lastNameInput = getElement<HTMLInputElement>('#last_name', form);
      const addressOneInput = getElement<HTMLInputElement>('#address_one', form);
      const addressTwoInput = getElement<HTMLInputElement>('#address_two', form);
      const cityInput = getElement<HTMLInputElement>('#city', form);
      const stateInput = getElement<HTMLInputElement>('#overview-state', form);
      const postalCodeInput = getElement<HTMLInputElement>('#postal_code', form); // Исправлен ID
      const emailInput = getElement<HTMLInputElement>('#email', form);
      const phoneInput = getElement<HTMLInputElement>('#phone', form);

      if (!firstNameInput || !lastNameInput || !addressOneInput || !addressTwoInput || !cityInput || !stateInput || !postalCodeInput || !emailInput || !phoneInput) {
        console.error('One or more form fields are missing.');
        return;
      }

      const formData: FormData = {
        first_name: firstNameInput.value,
        last_name: lastNameInput.value,
        address_one: addressOneInput.value,
        address_two: addressTwoInput.value,
        city: cityInput.value,
        state_province: stateInput.value,
        postal_code: postalCodeInput.value,
        email: emailInput.value,
        phone: formatPhoneNumber(phoneInput),
      };

      overviewRequest(formData);
    });

  function formatPhoneNumber(phoneInput: HTMLInputElement): string {
    const value = phoneInput.value;
    if (value) {
      const phoneNumberParse = parsePhoneNumberFromString(value);
      if (phoneNumberParse && phoneNumberParse.isValid()) {
        return phoneNumberParse.number.toString();
      }
      return value.replace(/\D/g, '');
    }
    return '';
  }
}
