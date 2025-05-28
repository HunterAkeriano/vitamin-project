export function getColorCard(type: string, className:string): string {
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
  return `${className}_${result}`;
}