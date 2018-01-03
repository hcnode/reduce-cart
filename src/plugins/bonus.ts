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
  return createCustomPlugin("bonus", (cart: CartWithSale) => {
    var { activities, actualTotal, items } = cart;
    var preTotal = actualTotal;
    var bonusItems = [];
    var reduceActivities = activities.map(activity => {
      if (activity.type == "bonus") {
        var sales = activity.sales;
        for (const sale of sales) {
          var { refItemId, bonusItem } = sale.apply.value;
          var existItem = items.find(item => item.goods.id == refItemId);
          if (existItem) {
            bonusItems.push({
              refItem: existItem,
              bonusItem
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
