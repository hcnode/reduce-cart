"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("../../");
const calculate_1 = require("../reducers/calculate");
const sale_1 = require("../plugins/sale");
const sale_2 = require("../plugins/sale");
function default_1() {
    return _1.createCustomPlugin("bonus", (cart) => {
        var { activities, actualTotal, items } = cart;
        items = calculate_1.filter(items);
        var preTotal = actualTotal;
        var bonusItems = [];
        var reduceActivities = activities.map(activity => {
            if (activity.type == "bonus") {
                var sales = activity.sales;
                for (const sale of sales) {
                    var { bonusId, threshold, amount, operator = sale_1.Operator.OPERATE_FREE, thresholdUnit = sale_2.ThresholdUnit.THRESHOLD_COUNT } = sale.rule;
                    var { validItems, unvalidItems, satisfy } = sale_2.satisfyThreshold(actualTotal, sale, items);
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
        return Object.assign({}, cart, { activities: reduceActivities, actualTotal,
            bonusItems });
    });
}
exports.default = default_1;
//# sourceMappingURL=bonus.js.map