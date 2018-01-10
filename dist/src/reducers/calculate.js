"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filter = items => {
    var result = items.filter(item => item.checked);
    return result;
};
exports.filter = filter;
exports.default = (cart) => {
    // 总金额（没有任何优惠）
    var grossTotal = filter(cart.items).reduce((total, item) => {
        total += item.goods.price * item.quantity;
        return total;
    }, 0);
    return Object.assign({}, cart, { grossTotal, actualTotal: grossTotal });
};
//# sourceMappingURL=calculate.js.map