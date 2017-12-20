"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const sale_1 = require("./src/plugins/sale");
exports.ActivityPlugin = sale_1.plugin;
const cart_1 = require("./src/reducers/cart");
const calculate_1 = require("./src/reducers/calculate");
const const_1 = require("./src/actions/const");
exports.CONST = const_1.default;
const actions = require("./src/actions/index");
exports.actions = actions;
var combineCalculate = extCalculates => {
    var allCalculates = [calculate_1.default].concat(extCalculates);
    return state => {
        var result = allCalculates.reduce((preState, calculate) => {
            var result = calculate(preState);
            return result;
        }, state);
        return result;
    };
};
var combineReducers = (extReducers, calculate) => {
    var allReducers = [cart_1.default].concat(extReducers);
    return (state, action) => {
        return calculate(allReducers.reduce((preState, reducer) => {
            return reducer(preState, action);
        }, state));
    };
};
exports.createReducers = (plugins) => {
    var calculate = combineCalculate(plugins.map(plugin => plugin.calculate));
    var reducer = combineReducers(plugins.map(plugin => plugin.reducer), calculate);
    return reducer;
};
exports.createCustomPlugin = (saleType, calculate) => {
    var customPlugin = sale_1.plugin(saleType);
    customPlugin.calculate = calculate;
    return customPlugin;
};
__export(require("./src/plugins/sale"));
__export(require("./src/interface"));
//# sourceMappingURL=index.js.map