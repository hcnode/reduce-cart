import { plugin, SaleType, Sale, ValidSale, CartWithSale, CartWithSaleFunc, extActions } from "./src/plugins/sale";
import cart from "./src/reducers/cart";
import calculate from "./src/reducers/calculate";
import CONST from "./src/actions/const";
import * as actions from "./src/actions/index";
import * as Interface from "./src/interface";
import * as redux from "redux";
import bonus from "./src/plugins/bonus";
import shipFree from "./src/plugins/shipFree";
var combineCalculate = extCalculates => {
  var allCalculates = [calculate].concat(extCalculates);
  return state => {
    var result = allCalculates.reduce((preState, calculate) => {
      var result = calculate(preState);
      return result;
    }, state);
    return result;
  };
};
var combineReducers = (extReducers, calculate) => {
  var allReducers = [cart].concat(extReducers);
  return (state, action) => {
    return calculate(
      allReducers.reduce((preState, reducer) => {
        return reducer(preState, action);
      }, state)
    );
  };
};
type SalePluginType = Interface.SalePlugin<CartWithSaleFunc, extActions>;
export var createReducers = (plugins: SalePluginType[]) => {
  var calculate = combineCalculate(plugins.map(plugin => plugin.calculate));
  var reducer = combineReducers(plugins.map(plugin => plugin.reducer), calculate);
  return reducer;
};
export var createCustomPlugin = (saleType: string, calculate): SalePluginType => {
  var customPlugin: SalePluginType = plugin(saleType);
  customPlugin.calculate = calculate;
  return customPlugin;
};
export * from "./src/plugins/sale";
export * from "./src/interface";
export { plugin as ActivityPlugin, actions, CONST };
export { bonus as bonusPlugin, shipFree as shipFreePlugin };
