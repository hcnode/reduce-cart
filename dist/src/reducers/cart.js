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
            var existItem = state.items.find(item => item.product.id == action.product.id);
            return Object.assign({}, state, { items: existItem
                    ? state.items.map(item => {
                        return item.product.id == action.product.id
                            ? Object.assign({}, item, { product: Object.assign({}, item.product, { price: action.product && action.product.price ? action.product.price : item.product.price }), quantity: type == const_1.default.UPDATE ? action.quantity : item.quantity + action.quantity, category: action.category ? action.category : item.category }) : Object.assign({}, item);
                    })
                    : [...state.items, { product: action.product, quantity: action.quantity, category: action.category }] });
        case const_1.default.REMOVE:
            var existItem = state.items.find(item => item.product.id == action.product.id);
            return Object.assign({}, state, { items: state.items.filter(item => item.product.id != action.product.id) });
        case const_1.default.ERROR:
            return Object.assign({}, state, { error: action.code });
        default:
            return state;
    }
};
//# sourceMappingURL=cart.js.map