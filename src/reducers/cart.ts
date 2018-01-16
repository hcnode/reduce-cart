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
      var existItem = state.items.find(item => item.goods.id == action.goods.id);
      return {
        ...state,
        items: existItem
          ? state.items.map(item => {
              return item.goods.id == action.goods.id
                ? {
                    ...item,
                    goods: {
                      ...item.goods,
                      price: action.goods && action.goods.price ? action.goods.price : item.goods.price
                    },
                    quantity: type == ActionType.UPDATE ? action.quantity : item.quantity + action.quantity,
                    category: action.category ? action.category : item.category
                  }
                : { ...item };
            })
          : [
              ...state.items,
              { goods: action.goods, quantity: action.quantity, category: action.category, checked: true }
            ]
      };
    case ActionType.REMOVE:
      return {
        ...state,
        items: state.items.filter(item => item.goods.id != action.goods.id)
      };
    case ActionType.CHECKED:
      return {
        ...state,
        items: state.items.map(
          item =>
            item.goods.id == action.goodsId
              ? {
                  ...item,
                  checked: action.checked
                }
              : item
        )
      };
    case ActionType.CHECKEDALL:
      return {
        ...state,
        items: state.items.map(item => ({
          ...item,
          checked: action.checked
        }))
      };
    case ActionType.EMPTY:
      return {
        ...state,
        items: []
      };
    case ActionType.REMOVECHECKED:
      return {
        ...state,
        items: state.items.filter(item => !item.checked)
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
