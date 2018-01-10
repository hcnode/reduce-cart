import { CategoryType, Item, Cart } from "../interface";
var filter = items => {
  var result = items.filter(item => item.checked)
  return result;
};

export default (cart: Cart): Cart => {
  // 总金额（没有任何优惠）
  var grossTotal = filter(cart.items).reduce((total, item) => {
    total += item.goods.price * item.quantity;
    return total;
  }, 0);
  return {
    ...cart,
    grossTotal,
    actualTotal: grossTotal
  };
};

export {filter}
