"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 通用中间件定义
 */
const interface_1 = require("../interface");
const index_1 = require("../actions/index");
/**
 * 优惠类型
 */
var SaleType;
(function (SaleType) {
    /**
     * 直减
     */
    SaleType[SaleType["ANY"] = 1] = "ANY";
    /**
     * 满减
     */
    SaleType[SaleType["THRESHOLD"] = 2] = "THRESHOLD";
    /**
     * 自定义
     */
    SaleType[SaleType["CUSTOM"] = 9] = "CUSTOM";
})(SaleType = exports.SaleType || (exports.SaleType = {}));
function isOk(result) {
    return result.code == 200;
}
/**
 * 活动相关的action的常量
 */
var CONST = {
    INIT_SALE: "INIT_SALE",
    CHOOSE_SALE: "CHOOSE_SALE"
};
/**
 * 活动的action定义
 */
var actions = {
    init_sale: (sales = [], saleType) => {
        sales = sales.map(item => (Object.assign({}, item, { rule: item.rule || {
                threshold: -1,
                amount: 0
            }, 
            // 不传apply默认是全场优惠
            apply: item.apply || {
                categoryType: interface_1.CategoryType.ALL,
                value: ""
            }, 
            // 默认是满减
            type: item.type || SaleType.THRESHOLD })));
        return {
            type: CONST.INIT_SALE,
            sales,
            saleType
        };
    },
    choose_sale: (saleId, saleType) => {
        return {
            type: CONST.CHOOSE_SALE,
            saleId,
            saleType
        };
    }
};
var thunk = {
    fetchSales: (ctx, api, saleType) => {
        return async (dispatch) => {
            var result = await api.fetch(ctx);
            if (isOk(result)) {
                dispatch(actions.init_sale(result.result, saleType));
            }
            else {
                dispatch(index_1.throwError(result.code));
            }
        };
    }
};
/**
 * 定义reducer
 */
var reducer = (saleType) => {
    return (state, action) => {
        // 初始化数据
        state = Object.assign({}, state, { activities: state.activities || [] });
        if (action.saleType != saleType) {
            return state;
        }
        // 已存在的活动
        var exitsSale = state.activities.find(activity => activity.type == action.saleType);
        switch (action.type) {
            case CONST.INIT_SALE:
                return Object.assign({}, state, { activities: exitsSale
                        ? // 如果已存在则替换
                            state.activities.map(activity => {
                                if (activity.type == saleType)
                                    return {
                                        sales: action.sales,
                                        type: saleType,
                                        validSales: [],
                                        chosenSale: null,
                                        defaultSale: null,
                                        bestSale: null
                                    };
                                else
                                    return activity;
                            })
                        : // 否则添加到最后
                            [
                                ...state.activities,
                                {
                                    sales: action.sales,
                                    type: saleType,
                                    validSales: [],
                                    chosenSale: null,
                                    defaultSale: null,
                                    bestSale: null
                                }
                            ] });
            // 选择活动
            case CONST.CHOOSE_SALE:
                var result = Object.assign({}, state, { activities: state.activities.map(activity => {
                        if (activity.type == saleType) {
                            return Object.assign({}, activity, { chosenSale: activity.validSales.find(validSale => validSale.sale.id == action.saleId) });
                        }
                        else {
                            return activity;
                        }
                    }) });
                return result;
            default:
                return Object.assign({}, state);
        }
    };
};
/**
 * 计算相关数据
 * @param saleType
 */
var calculate = (saleType) => {
    return (cart) => {
        var { grossTotal, activities, items } = cart;
        var preTotal = grossTotal;
        var reduceActivities = activities.map(activity => {
            var { sales, chosenSale, type } = activity;
            if (sales[0].type == SaleType.CUSTOM)
                return Object.assign({}, activity);
            var validSales = sales
                .map((sale) => {
                var categoryType = sale.apply.categoryType;
                var reduceAmount = sale.rule.amount;
                var value = sale.apply.value;
                var result = {
                    sale,
                    actualTotal: preTotal - reduceAmount,
                    reduceAmount
                };
                // 直减
                if (sale.type == SaleType.ANY) {
                    if (categoryType == interface_1.CategoryType.ALL) {
                        // 所有商品可以使用
                        return Object.assign({}, result, { validItems: [...items] });
                    }
                    else {
                        var validItems = items.filter(item => (categoryType == interface_1.CategoryType.GOODS ? item.goods.id == value : item.category == value));
                        return validItems.length > 0
                            ? Object.assign({}, result, { validItems }) : null;
                    }
                }
                else {
                    // 满减，todo：以后可能还有其他类型？
                    if (categoryType == interface_1.CategoryType.ALL) {
                        // 所有商品可以使用
                        return grossTotal >= sale.rule.threshold
                            ? Object.assign({}, result, { validItems: [...items] }) : null;
                    }
                    else {
                        // 仅限某些类目可以使用，TODO：以后可能还有其他限制？
                        var validItems = [];
                        var grossTotalByCategory = items.reduce((total, item) => {
                            var match = value == (categoryType == interface_1.CategoryType.GOODS ? item.goods.id : item.category);
                            if (match) {
                                validItems.push(item);
                                total += item.goods.price * item.quantity;
                            }
                            return total;
                        }, 0);
                        return grossTotalByCategory > sale.rule.threshold
                            ? Object.assign({}, result, { validItems }) : null;
                    }
                }
            })
                .filter(item => item);
            // 最佳活动
            var bestSale = validSales.reduce((selectedSale, validSale) => {
                selectedSale = selectedSale || validSale;
                if (selectedSale.reduceAmount < validSale.reduceAmount) {
                    selectedSale = validSale;
                }
                return selectedSale;
            }, null);
            // 重新找以选择的活动，如果该活动已无效，则变成null
            if (chosenSale) {
                chosenSale = validSales.find(validSale => validSale.sale.id == chosenSale.sale.id);
            }
            // 默认活动是最佳活动
            var defaultSale = bestSale;
            // 优惠后总额优先数按需：选择的活动 -> 默认活动（最佳活动）-> 前一个活动总额
            var actualTotal = chosenSale ? chosenSale.actualTotal : defaultSale ? defaultSale.actualTotal : preTotal;
            var preTotal2 = preTotal;
            preTotal = actualTotal;
            return {
                sales,
                validSales,
                bestSale,
                defaultSale,
                chosenSale,
                preTotal: preTotal2,
                actualTotal,
                type
            };
        });
        // 最后的一个活动
        var finalActivity = reduceActivities[reduceActivities.length - 1];
        return Object.assign({}, cart, { activities: reduceActivities, 
            // 使用最后一个活动的实际总额作为最终总额
            actualTotal: preTotal });
    };
};
/**
 * 插件的定义
 * @param type
 */
exports.plugin = (type) => {
    return {
        CONST,
        actions,
        reducer: reducer(type),
        thunk,
        calculate: calculate(type)
    };
};
//# sourceMappingURL=sale.js.map