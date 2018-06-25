import { Cart } from "../interface";
import ActionType from "../actions/const";
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
    // 初始化商品数据
    case ActionType.INIT_CART:
      return { ...state, items: action.items };
    // 添加或者是更新购物车
    case ActionType.ADD:
    case ActionType.UPDATE:
      var existItem = state.items.find(item => item.goods.id == action.goods.id);
      return {
        ...state,
        items: existItem
          ? state.items.map(item => {
              return item.goods.id == action.goods.id
                // 更新一个存在的商品
                ? {
                    ...item,
                    goods: {
                      ...item.goods,
                      price: action.goods && action.goods.price ? action.goods.price : item.goods.price
                    },
                    // 如果是update操作，则替换数量，否则累加数量
                    quantity: type == ActionType.UPDATE ? action.quantity : item.quantity + action.quantity,
                    categories: action.categories || item.categories
                  }
                // 否则直接返回
                : { ...item };
            })
          // 添加一个新商品
          : [
              ...state.items,
              { goods: action.goods, quantity: action.quantity, categories: action.categories, checked: true }
            ]
      };
    // 删除商品
    case ActionType.REMOVE:
      return {
        ...state,
        items: state.items.filter(item => item.goods.id != action.goods.id)
      };
    // 选择商品
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
    // 选中所有
    case ActionType.CHECKEDALL:
      return {
        ...state,
        items: state.items.map(item => ({
          ...item,
          checked: action.checked
        }))
      };
    // 清空商品
    case ActionType.EMPTY:
      return {
        ...state,
        items: []
      };
    // 删除选中
    case ActionType.REMOVECHECKED:
      return {
        ...state,
        items: state.items.filter(item => !item.checked)
      };
    // 错误，暂时没使用到
    case ActionType.ERROR:
      return {
        ...state,
        error: action.code
      };
    default:
      return state;
  }
};
