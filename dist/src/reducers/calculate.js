"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (cart) => {
    // 总金额（没有任何优惠）
    var grossTotal = cart.items.reduce((total, item) => {
        total += item.product.price * item.quantity;
        return total;
    }, 0);
    return Object.assign({}, cart, { grossTotal, actualTotal: grossTotal });
};
//# sourceMappingURL=calculate.js.map