"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * action定义
 */
const const_1 = require("./const");
function init_cart(data) {
    return {
        type: const_1.default.INIT_CART,
        items: data
    };
}
exports.init_cart = init_cart;
function add(item) {
    return Object.assign({ type: const_1.default.ADD }, item);
}
exports.add = add;
function remove(item) {
    return Object.assign({ type: const_1.default.REMOVE }, item);
}
exports.remove = remove;
function update(item) {
    return Object.assign({ type: const_1.default.UPDATE }, item);
}
exports.update = update;
function throwError(code) {
    return {
        type: const_1.default.UPDATE,
        code
    };
}
exports.throwError = throwError;
//# sourceMappingURL=index.js.map