import { plugin, CartWithSale, extActions } from "./src/plugins/sale";
import CONST from "./src/actions/const";
import * as actions from "./src/actions/index";
import * as Interface from "./src/interface";
import * as redux from 'redux';
export declare var createReducers: (plugins: Interface.SalePlugin<redux.Reducer<CartWithSale>, extActions>[]) => (state: any, action: any) => any;
export declare var createCustomPlugin: (saleType: string, calculate: any) => Interface.SalePlugin<redux.Reducer<CartWithSale>, extActions>;
export * from "./src/plugins/sale";
export * from "./src/interface";
export { plugin as ActivityPlugin, actions, CONST };