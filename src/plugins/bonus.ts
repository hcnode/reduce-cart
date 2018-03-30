import {
  createReducers,
  ActivityPlugin,
  SaleType,
  Sale,
  ValidSale,
  CartWithSale,
  CartWithSaleFunc,
  CategoryType,
  Item,
  Cart,
  SalePlugin,
  actions,
  CONST,
  createCustomPlugin,
  extActions
} from "../../";
import * as redux from "redux";
import { filter } from "../reducers/calculate";
import { Operator } from "../plugins/sale";
import { ThresholdUnit, matchApply, satisfyThreshold } from "../plugins/sale";

export default function() {
  return createCustomPlugin("bonus", (cart: CartWithSale) => {
    var { activities, actualTotal, items } = cart;
    items = filter(items);
    var preTotal = actualTotal;
    var bonusItems = [];
    var reduceActivities = activities.map(activity => {
      if (activity.type == "bonus") {
        var sales = activity.sales;
        for (const sale of sales) {
          var {
            bonusId,
            threshold,
            amount,
            operator = Operator.OPERATE_FREE,
            thresholdUnit = ThresholdUnit.THRESHOLD_COUNT
          } = sale.rule;
          var { validItems, unvalidItems, satisfy } = satisfyThreshold(actualTotal, sale, items);
          if (satisfy) {
            bonusItems.push({
              refItems: validItems,
              bonusId,
              count: amount
            });
          }
        }
      }
      return activity;
    });
    return {
      ...cart,
      activities: reduceActivities,
      actualTotal,
      bonusItems
    };
  });
}
