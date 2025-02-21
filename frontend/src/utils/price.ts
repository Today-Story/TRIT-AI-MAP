export const formatPrice = (price: string) => {
  return price.includes("$") ? price : price + "원";
};
