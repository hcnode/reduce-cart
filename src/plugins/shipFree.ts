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
export default function() {
  return createCustomPlugin("shipFree", (cart: CartWithSale) => {
    var activities = cart.activities;
    var preTotal = cart.actualTotal;
    var actualTotal = cart.actualTotal;
    var reduceActivities = activities.map(activity => {
      if (activity.type == "shipFree") {
        var sale = activity.sales[0];
        actualTotal = preTotal >= sale.rule.threshold ? preTotal : preTotal + sale.rule.amount;
        actualTotal = Math.max(0, actualTotal);
        return {
          ...activity,
          preTotal,
          actualTotal
        };
      } else {
        return activity;
      }
    });
    return {
      ...cart,
      activities: reduceActivities,
      actualTotal
    };
  });
}
