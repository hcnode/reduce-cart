import { CategoryType, Item, Cart } from "../interface";
export default (cart: Cart): Cart => {
  // 总金额（没有任何优惠）
  var grossTotal = cart.items.reduce((total, item) => {
    total += item.product.price * item.quantity;
    return total;
  }, 0);
  return {
    ...cart,
    grossTotal,
    actualTotal : grossTotal
  };
};
