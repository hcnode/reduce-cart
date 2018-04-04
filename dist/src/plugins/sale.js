"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 通用中间件定义
 */
const interface_1 = require("../interface");
const index_1 = require("../actions/index");
const calculate_1 = require("../reducers/calculate");
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
/**
 * 折扣类型
 */
var Operator;
(function (Operator) {
    Operator[Operator["OPERATE_PRICE"] = 1] = "OPERATE_PRICE";
    Operator[Operator["OPERATE_COUNT"] = 2] = "OPERATE_COUNT";
    Operator[Operator["OPERATE_DISCOUNT"] = 3] = "OPERATE_DISCOUNT";
    Operator[Operator["OPERATE_FREE"] = 4] = "OPERATE_FREE";
})(Operator = exports.Operator || (exports.Operator = {}));
/**
 * 门槛的单位
 */
var ThresholdUnit;
(function (ThresholdUnit) {
    ThresholdUnit[ThresholdUnit["THRESHOLD_PRICE"] = 1] = "THRESHOLD_PRICE";
    ThresholdUnit[ThresholdUnit["THRESHOLD_COUNT"] = 2] = "THRESHOLD_COUNT";
})(ThresholdUnit = exports.ThresholdUnit || (exports.ThresholdUnit = {}));
function isOk(result) {
    return result.code == 200;
}
/**
 * 活动相关的action的常量
 */
var CONST = {
    INIT_SALE: "CART_INIT_SALE",
    CHOOSE_SALE: "CART_CHOOSE_SALE",
    CHOOSE_NONE: "CART_CHOOSE_NONE"
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
    },
    choose_none: (saleType) => {
        return {
            type: CONST.CHOOSE_NONE,
            saleType
        };
    }
};
exports.saleAction = actions;
var thunk = {
    fetchSales: (ctx, api, saleType) => {
        return async (dispatch) => {
            var result = await api.fetch(ctx);
            var cartActivitiesResult = await api.getCartActivities(ctx);
            if (isOk(result)) {
                dispatch(actions.init_sale(result.result, saleType));
                var cartActivities = cartActivitiesResult.result;
                for (var activity of cartActivities) {
                    if (activity.type == saleType && activity.chooseId) {
                        dispatch(actions.choose_sale(activity.chooseId, saleType));
                    }
                }
            }
            else {
                dispatch(index_1.throwError(result.code));
            }
        };
    },
    chooseActivity: (ctx, api, saleType, sale) => {
        return async (dispatch) => {
            var result = await api.choose(ctx, { type: saleType, chooseId: sale.id });
            if (isOk(result)) {
                var activities = result.result;
                for (var activity of activities) {
                    if (activity.type == saleType) {
                        dispatch(actions.choose_sale(activity.chooseId, saleType));
                    }
                }
            }
            else {
                dispatch(index_1.throwError(result.code));
            }
        };
    },
    chooseNone: (ctx, api, saleType) => {
        return async (dispatch) => {
            var result = await api.chooseNone(ctx, { type: saleType });
            if (isOk(result)) {
                dispatch(actions.choose_none(saleType));
            }
            else {
                dispatch(index_1.throwError(result.code));
            }
        };
    }
};
exports.thunk = thunk;
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
                                    return Object.assign({}, exitsSale, { sales: action.sales, type: saleType, validSales: [], unvalidSales: [], 
                                        // chosenSale: null,
                                        defaultSale: null, bestSale: null });
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
                                    unvalidSales: [],
                                    chosenSale: null,
                                    defaultSale: null,
                                    bestSale: null
                                }
                            ] });
            // 选择活动
            case CONST.CHOOSE_SALE:
                var result = Object.assign({}, state, { activities: state.activities.map(activity => {
                        if (activity.type == saleType) {
                            return Object.assign({}, activity, { chosenSale: activity.validSales.find(validSale => validSale.sale.id == action.saleId), chooseNone: false });
                        }
                        else {
                            return activity;
                        }
                    }) });
                return result;
            case CONST.CHOOSE_NONE:
                var result = Object.assign({}, state, { activities: state.activities.map(activity => {
                        if (activity.type == saleType) {
                            return Object.assign({}, activity, { chooseNone: true });
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
function calculateActualTotal(preTotal, validSale) {
    var { operator = Operator.OPERATE_PRICE, thresholdUnit = ThresholdUnit.THRESHOLD_PRICE, amount } = validSale.sale.rule;
    var actualTotal = preTotal;
    var reduceAmount = 0;
    var validItem = validSale.validItems.filter(item => item.belonged);
    var validActualTotal = validItem.reduce((total, item) => {
        return total + item.quantity * item.goods.price;
    }, 0);
    switch (operator) {
        case Operator.OPERATE_PRICE:
            reduceAmount = amount;
            actualTotal = preTotal - amount;
            break;
        case Operator.OPERATE_DISCOUNT:
            reduceAmount = validActualTotal * amount / 100;
            actualTotal = preTotal - reduceAmount;
            break;
    }
    var subReduceAmountTotal = 0;
    var validItems = validItem.map((item, i) => {
        var subtotal = item.quantity * item.goods.price;
        var subReduceAmount = validItem.length - 1 != i ? reduceAmount * (subtotal / validActualTotal) : reduceAmount - subReduceAmountTotal;
        subReduceAmountTotal += subReduceAmount;
        return Object.assign({}, item, { subtotal: subtotal - subReduceAmount, subReduceAmount });
    });
    return Object.assign({}, validSale, { validItems,
        actualTotal,
        reduceAmount,
        subReduceAmountTotal });
}
function matchApply(item, { categoryType, value }) {
    return (
    // 匹配所有商品
    categoryType == interface_1.CategoryType.ALL ||
        // 匹配单个商品
        (categoryType == interface_1.CategoryType.GOODS && value == item.goods.id) ||
        // 匹配类目
        (item.categories || []).indexOf(value) > -1);
}
exports.matchApply = matchApply;
function satisfyThreshold(preTotal, sale, items) {
    var { operator = Operator.OPERATE_PRICE, thresholdUnit = ThresholdUnit.THRESHOLD_PRICE, amount, threshold } = sale.rule;
    var type = sale.type;
    var isNoThreshold = sale.type == SaleType.ANY;
    var actualTotal = preTotal;
    var reduceAmount = 0;
    var validItems = [];
    var unvalidItems = [];
    var validActualTotal = items.reduce((total, item) => {
        var isMatch = matchApply(item, sale.apply);
        if (isMatch) {
            validItems.push(Object.assign({}, item, { belonged: true }));
            return {
                totalPrice: total.totalPrice + item.quantity * item.goods.price,
                totalCount: total.totalCount + item.quantity
            };
        }
        else {
            unvalidItems.push(item);
            return total;
        }
    }, { totalPrice: 0, totalCount: 0 });
    return {
        validItems,
        unvalidItems,
        satisfy: validItems.length > 0 &&
            (isNoThreshold ||
                (ThresholdUnit.THRESHOLD_COUNT == thresholdUnit
                    ? validActualTotal.totalCount >= threshold
                    : ThresholdUnit.THRESHOLD_PRICE == thresholdUnit ? validActualTotal.totalPrice >= threshold : true))
    };
}
exports.satisfyThreshold = satisfyThreshold;
/**
 * 计算相关数据
 * @param saleType
 */
var calculate = (saleType) => {
    return (cart) => {
        var { grossTotal, activities, items } = cart;
        items = calculate_1.filter(items);
        var preTotal = grossTotal;
        var reduceActivities = activities.map(activity => {
            var { sales, chosenSale, type, chooseNone } = activity;
            if (sales[0] && sales[0].type == SaleType.CUSTOM)
                return Object.assign({}, activity);
            var validAndNotSales = sales.map((sale) => {
                var categoryType = sale.apply.categoryType;
                var reduceAmount = sale.rule.amount;
                var value = sale.apply.value;
                var { validItems, unvalidItems, satisfy } = satisfyThreshold(preTotal, sale, items);
                var result = {
                    sale,
                    validItems,
                    unvalidItems,
                    satisfy
                };
                return satisfy ? calculateActualTotal(preTotal, result) : result;
            });
            var validSales = validAndNotSales.filter(item => item.satisfy);
            var unvalidSales = validAndNotSales.filter(item => !item.satisfy);
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
            var actualTotal = chooseNone
                ? preTotal
                : chosenSale ? chosenSale.actualTotal : defaultSale ? defaultSale.actualTotal : preTotal;
            var preTotal2 = preTotal;
            preTotal = actualTotal;
            return {
                sales,
                validSales,
                unvalidSales,
                bestSale,
                defaultSale,
                chosenSale,
                preTotal: preTotal2,
                actualTotal,
                chooseNone,
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
        calculate: calculate(type)
    };
};
//# sourceMappingURL=sale.js.map