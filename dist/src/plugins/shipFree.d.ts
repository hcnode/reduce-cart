import { CartWithSale, SalePlugin, extActions } from "../../";
import * as redux from "redux";
export default function (): SalePlugin<redux.Reducer<CartWithSale>, extActions>;
