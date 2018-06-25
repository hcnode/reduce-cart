import { Cart } from "../interface";
/**
 * 过滤没有选中的商品
 * @param items 
 */
var filter = items => {
  var result = items.filter(item => item.checked)
  return result;
};
/**
 * 计算相关金额
 */
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
