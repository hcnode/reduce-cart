import { CategoryType, Item, Cart } from "../interface";
import ActionType from "../actions/const";
import sale from "../plugins/sale";
// 商品增删改
// 计算出可用活动、选择的活动、总金额、实际支付金额
export default (
  state: Cart = {
    items: [],
    grossTotal: 0,
    actualTotal: 0,
    error: null
  },
  action
): Cart => {
  var type = action.type;
  switch (type) {
    case ActionType.INIT_CART:
      return { ...state, items: action.items };
    case ActionType.ADD:
    case ActionType.UPDATE:
      var existItem = state.items.find(item => item.product.id == action.product.id);
      return {
        ...state,
        items: existItem
          ? state.items.map(item => {
              return item.product.id == action.product.id
                ? {
                    ...item,
                    product : {...item.product, price : action.product && action.product.price ? action.product.price : item.product.price},
                    quantity: type == ActionType.UPDATE ? action.quantity : item.quantity + action.quantity,
                    category: action.category ? action.category : item.category
                  }
                : { ...item };
            })
          : [...state.items, { product: action.product, quantity: action.quantity, category: action.category }]
      };
    case ActionType.REMOVE:
      var existItem = state.items.find(item => item.product.id == action.product.id);
      return {
        ...state,
        items: state.items.filter(item => item.product.id != action.product.id)
      };
    case ActionType.ERROR:
      return {
        ...state,
        error: action.code
      };
    default:
      return state;
  }
};
