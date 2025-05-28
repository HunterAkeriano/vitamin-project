import IMask from 'imask';


export function phoneMask(){
  const phoneInput = document.getElementById('phone') ;
  if (!phoneInput) return;
  IMask(phoneInput, {
    mask: '+{38} (000)000-00-00',
  });



}