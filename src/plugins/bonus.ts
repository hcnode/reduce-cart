import {
  CartWithSale,
  createCustomPlugin,
} from "../../";
import { filter } from "../reducers/calculate";
import { satisfyThreshold } from "../plugins/sale";
/**
 * built-in赠品活动插件
 */
export default function() {
  return createCustomPlugin("bonus", (cart: CartWithSale) => {
    var { activities, actualTotal, items } = cart;
    items = filter(items);
    var bonusItems = [];
    var reduceActivities = activities.map(activity => {
      // 只影响赠品类型活动
      if (activity.type == "bonus") {
        var sales = activity.sales;
        for (const sale of sales) {
          var {
            bonusId,
            amount,
          } = sale.rule;
          // 当前购物车是否满足定义的赠品活动
          var { validItems, satisfy } = satisfyThreshold(actualTotal, sale, items);
          if (satisfy) {
            bonusItems.push({
              // 满足的购物车商品列表
              refItems: validItems,
              // 赠品id
              bonusId,
              // 赠品的数量
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
      // 赠品信息放在购物车的最外层对象
      bonusItems
    };
  });
}
