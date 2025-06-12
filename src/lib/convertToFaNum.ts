export const convertToFaNum = (number: string | number) => {
 return new Intl.NumberFormat("fa-IR").format(Number(number));
};
