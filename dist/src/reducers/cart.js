"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("../actions/const");
// 商品增删改
// 计算出可用活动、选择的活动、总金额、实际支付金额
exports.default = (state = {
        items: [],
        grossTotal: 0,
        actualTotal: 0,
        error: null
    }, action) => {
    var type = action.type;
    switch (type) {
        case const_1.default.INIT_CART:
            return Object.assign({}, state, { items: action.items });
        case const_1.default.ADD:
        case const_1.default.UPDATE:
            var existItem = state.items.find(item => item.goods.id == action.goods.id);
            return Object.assign({}, state, { items: existItem
                    ? state.items.map(item => {
                        return item.goods.id == action.goods.id
                            ? Object.assign({}, item, { goods: Object.assign({}, item.goods, { price: action.goods && action.goods.price ? action.goods.price : item.goods.price }), quantity: type == const_1.default.UPDATE ? action.quantity : item.quantity + action.quantity, category: action.category ? action.category : item.category }) : Object.assign({}, item);
                    })
                    : [
                        ...state.items,
                        { goods: action.goods, quantity: action.quantity, category: action.category, checked: true }
                    ] });
        case const_1.default.REMOVE:
            return Object.assign({}, state, { items: state.items.filter(item => item.goods.id != action.goods.id) });
        case const_1.default.CHECKED:
            return Object.assign({}, state, { items: state.items.map(item => item.goods.id == action.goodsId
                    ? Object.assign({}, item, { checked: action.checked }) : item) });
        case const_1.default.CHECKEDALL:
            return Object.assign({}, state, { items: state.items.map(item => (Object.assign({}, item, { checked: action.checked }))) });
        case const_1.default.EMPTY:
            return Object.assign({}, state, { items: [] });
        case const_1.default.REMOVECHECKED:
            return Object.assign({}, state, { items: state.items.filter(item => !item.checked) });
        case const_1.default.ERROR:
            return Object.assign({}, state, { error: action.code });
        default:
            return state;
    }
};
//# sourceMappingURL=cart.js.map