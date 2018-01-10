"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("../../");
const calculate_1 = require("../reducers/calculate");
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
        return Object.assign({}, cart, { activities: reduceActivities, actualTotal,
            bonusItems });
    });
}
exports.default = default_1;
//# sourceMappingURL=bonus.js.map