"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("../../");
function default_1() {
    return _1.createCustomPlugin("shipFree", (cart) => {
        var activities = cart.activities;
        var preTotal = cart.actualTotal;
        var actualTotal = cart.actualTotal;
        var reduceActivities = activities.map(activity => {
            if (activity.type == "shipFree") {
                var sale = activity.sales[0];
                actualTotal = preTotal >= sale.rule.threshold ? preTotal : preTotal + sale.rule.amount;
                return Object.assign({}, activity, { preTotal,
                    actualTotal });
            }
            else {
                return activity;
            }
        });
        return Object.assign({}, cart, { activities: reduceActivities, actualTotal });
    });
}
exports.default = default_1;
//# sourceMappingURL=shipFree.js.map