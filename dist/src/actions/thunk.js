"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {GetCart, GetSales} from '../api'
const index_1 = require("./index");
function isOk(result) {
    return result.code == 200;
}
function fetchItems(ctx, api) {
    return async (dispatch) => {
        var result = await api.fetch(ctx);
        if (isOk(result)) {
            dispatch(index_1.init_cart(result.result));
        }
        else {
            dispatch(index_1.throwError(result.code));
        }
    };
}
exports.fetchItems = fetchItems;
/**
 * redux中间件thunk定义
 */
function addItem(ctx, item, api) {
    return async (dispatch) => {
        var result = await api.add(ctx, item);
        if (isOk(result)) {
            dispatch(index_1.add(item));
        }
        else {
            dispatch(index_1.throwError(result.code));
        }
    };
}
exports.addItem = addItem;
function removeItem(ctx, item, api) {
    return async (dispatch) => {
        var result = await api.remove(ctx, item);
        if (isOk(result)) {
            dispatch(index_1.remove(item));
        }
        else {
            dispatch(index_1.throwError(result.code));
        }
    };
}
exports.removeItem = removeItem;
function updateItem(ctx, item, api) {
    return async (dispatch) => {
        var result = await api.update(ctx, item);
        if (isOk(result)) {
            dispatch(index_1.update(item));
        }
        else {
            dispatch(index_1.throwError(result.code));
        }
    };
}
exports.updateItem = updateItem;
function checkedItem(ctx, item, api) {
    return async (dispatch) => {
        var result = await api.checked(ctx, item);
        if (isOk(result)) {
            dispatch(index_1.checked(item));
        }
        else {
            dispatch(index_1.throwError(result.code));
        }
    };
}
exports.checkedItem = checkedItem;
function checkedAllItems(ctx, api, checked) {
    return async (dispatch) => {
        var result = await api.checkedAll(ctx);
        if (isOk(result)) {
            dispatch(index_1.checkedAll(checked));
        }
        else {
            dispatch(index_1.throwError(result.code));
        }
    };
}
exports.checkedAllItems = checkedAllItems;
function emptyItems(ctx, api) {
    return async (dispatch) => {
        var result = await api.empty(ctx);
        if (isOk(result)) {
            dispatch(index_1.empty());
        }
        else {
            dispatch(index_1.throwError(result.code));
        }
    };
}
exports.emptyItems = emptyItems;
//# sourceMappingURL=thunk.js.map