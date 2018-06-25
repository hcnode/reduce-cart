import { plugin, CartWithSaleFunc, extActions } from "./src/plugins/sale";
import cart from "./src/reducers/cart";
import calculate from "./src/reducers/calculate";
import CONST from "./src/actions/const";
import * as actions from "./src/actions/index";
import * as Interface from "./src/interface";
import bonus from "./src/plugins/bonus";
import shipFree from "./src/plugins/shipFree";
type SalePluginType = Interface.SalePlugin<CartWithSaleFunc, extActions>;
// 组合活动计算
var combineCalculate = extCalculates => {
  var allCalculates = [calculate, ...extCalculates];
  return state => {
    var result = allCalculates.reduce((preState, calculate) => {
      var result = calculate(preState);
      return result;
    }, state);
    return result;
  };
};

// 组合reducer
var combineReducers = (extReducers, calculate) => {
  var allReducers = [cart, ...extReducers];
  return (state, action) => {
    return calculate(
      allReducers.reduce((preState, reducer) => {
        return reducer(preState, action);
      }, state)
    );
  };
};
// 创建reducer
export var createReducers = (plugins: SalePluginType[]) => {
  var calculate = combineCalculate(plugins.map(plugin => plugin.calculate));
  var reducer = combineReducers(plugins.map(plugin => plugin.reducer), calculate);
  return reducer;
};
// 创建自定义活动插件
export var createCustomPlugin = (saleType: string, calculate): SalePluginType => {
  var customPlugin: SalePluginType = plugin(saleType);
  customPlugin.calculate = calculate;
  return customPlugin;
};

export * from "./src/plugins/sale";
export * from "./src/interface";
export { plugin as ActivityPlugin, actions, CONST };
export { bonus as bonusPlugin, shipFree as shipFreePlugin };
export * from './src/actions/thunk'
export {thunk as activityThunk} from './src/plugins/sale'