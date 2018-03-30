/**
 * 通用中间件定义
 */
import { CategoryType, Item, Cart, SalePlugin, Actions } from "../interface";
import { init_cart, add, remove, update, throwError } from "../actions/index";
import { Api } from "../interface";
import * as redux from "redux";
import { filter } from "../reducers/calculate";
/**
 * 活动定义，可以是比如全场满减活动，优惠券等
 *
 * @interface Sale
 */
export interface Sale {
  id: string;
  name: string;
  /**
   * 直减还是满减
   */
  type: SaleType;
  /**
   * 规则，满减的额度和减去的金额
   *
   */
  rule: {
    threshold: number;
    amount: number;
    desc?: string;
    operator?: number;
    thresholdUnit?: number;
    bonusId? : string
  };
  /**
   * 应用的商品，限定某个类目还是所有商品
   */
  apply?: {
    categoryType: CategoryType;
    value: any;
  };
}
/**
 * 可用的活动
 */
export interface ValidSale {
  /**
   * 活动对象
   */
  sale: Sale;
  /**
   * 可使用的商品
   */
  validItems: Item[];
  /**
   * 不可使用的商品
   */
  unvalidItems: Item[];
  /**
   * 实际支付金额
   */
  actualTotal: number;
  /**
   * 优惠的金额
   */
  reduceAmount: number;
  subReduceAmountTotal?: number;
}
/**
 * 优惠类型
 */
export enum SaleType {
  /**
   * 直减
   */
  ANY = 1,
  /**
   * 满减
   */
  THRESHOLD = 2,
  /**
   * 自定义
   */
  CUSTOM = 9
}
/**
 * 折扣类型
 */
export enum Operator {
  OPERATE_PRICE = 1,
  OPERATE_COUNT = 2,
  OPERATE_DISCOUNT = 3,
  OPERATE_FREE = 4
}
/**
 * 门槛的单位
 */
export enum ThresholdUnit {
  THRESHOLD_PRICE = 1,
  THRESHOLD_COUNT = 2
}
/**
 * 活动类型
 */
export interface Activity {
  /**
   * 所有的活动信息
   */
  sales: Sale[];
  /**
   * 当前购物车可用的活动
   */
  validSales: ValidSale[];
  /**
   * 当前购物车不可用的活动
   */
  unvalidSales: ValidSale[];
  /**
   * 选择的活动
   */
  chosenSale: ValidSale;
  /**
   * 默认活动
   */
  defaultSale: ValidSale;
  /**
   * 最佳活动
   */
  bestSale: ValidSale;
  /**
   * 类型，活动还是优惠券
   */
  type: string;
  /**
   * 上一个支付总额
   */
  preTotal?: number;
  /**
   * 实际支付
   */
  actualTotal?: number;

  /**
   * 手动不选择任何优惠
   *
   * @type {Boolean}
   * @memberof Activity
   */
  chooseNone?: Boolean;
}
/**
 * 扩展购物车接口
 */
export interface CartWithSale extends Cart {
  activities: Activity[];
  bonusItems? : {
    refItems : Item[]
    count : number
    bonusId : string
    bonusItem? : Item
  }
}
/**
 * 购物车接口函数
 */
export type CartWithSaleFunc = redux.Reducer<CartWithSale>;

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
export interface extActions extends Actions {
  init_sale: (data: Sale[], saleType: string) => redux.AnyAction;
  choose_sale: (data: string, saleType: string) => redux.AnyAction;
  choose_none: (saleType: string) => redux.AnyAction;
}
/**
 * 活动的action定义
 */
var actions: extActions = {
  init_sale: (sales = [], saleType): redux.AnyAction => {
    sales = sales.map(item => ({
      ...item,
      rule: item.rule || {
        threshold: -1,
        amount: 0
      },
      // 不传apply默认是全场优惠
      apply: item.apply || {
        categoryType: CategoryType.ALL,
        value: ""
      },
      // 默认是满减
      type: item.type || SaleType.THRESHOLD
    }));
    return {
      type: CONST.INIT_SALE,
      sales,
      saleType
    };
  },
  choose_sale: (saleId, saleType): redux.AnyAction => {
    return {
      type: CONST.CHOOSE_SALE,
      saleId,
      saleType
    };
  },
  choose_none: (saleType): redux.AnyAction => {
    return {
      type: CONST.CHOOSE_NONE,
      saleType
    };
  }
};
var thunk = {
  fetchSales: (ctx, api: Api, saleType) => {
    return async dispatch => {
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
      } else {
        dispatch(throwError(result.code));
      }
    };
  },
  chooseActivity: (ctx, api: Api, saleType, sale) => {
    return async dispatch => {
      var result = await api.choose(ctx, { type: saleType, chooseId: sale.id });
      if (isOk(result)) {
        var activities = result.result;
        for (var activity of activities) {
          if (activity.type == saleType) {
            dispatch(actions.choose_sale(activity.chooseId, saleType));
          }
        }
      } else {
        dispatch(throwError(result.code));
      }
    };
  },
  chooseNone: (ctx, api: Api, saleType) => {
    return async dispatch => {
      var result = await api.chooseNone(ctx, { type: saleType });
      if (isOk(result)) {
        dispatch(actions.choose_none(saleType));
      } else {
        dispatch(throwError(result.code));
      }
    };
  }
};
/**
 * 定义reducer
 */
var reducer = (saleType): CartWithSaleFunc => {
  return (state: CartWithSale, action: redux.AnyAction): CartWithSale => {
    // 初始化数据
    state = {
      ...state,
      activities: state.activities || []
    };

    if (action.saleType != saleType) {
      return state;
    }
    // 已存在的活动
    var exitsSale = state.activities.find(activity => activity.type == action.saleType);
    switch (action.type) {
      case CONST.INIT_SALE:
        return {
          ...state,
          activities: exitsSale
            ? // 如果已存在则替换
              state.activities.map(activity => {
                if (activity.type == saleType)
                  return {
                    sales: action.sales,
                    type: saleType,
                    validSales: [],
                    unvalidSales: [],
                    chosenSale: null,
                    defaultSale: null,
                    bestSale: null
                  };
                else return activity;
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
              ]
        };
      // 选择活动
      case CONST.CHOOSE_SALE:
        var result = {
          ...state,
          activities: state.activities.map(activity => {
            if (activity.type == saleType) {
              return {
                ...activity,
                chosenSale: activity.validSales.find(validSale => validSale.sale.id == action.saleId),
                chooseNone: false
              };
            } else {
              return activity;
            }
          })
        };
        return result;
      case CONST.CHOOSE_NONE:
        var result = {
          ...state,
          activities: state.activities.map(activity => {
            if (activity.type == saleType) {
              return {
                ...activity,
                chooseNone: true
              };
            } else {
              return activity;
            }
          })
        };
        return result;
      default:
        return {
          ...state
        };
    }
  };
};
function calculateActualTotal(preTotal, validSale: ValidSale) {
  var {
    operator = Operator.OPERATE_PRICE,
    thresholdUnit = ThresholdUnit.THRESHOLD_PRICE,
    amount
  } = validSale.sale.rule;
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
    var subReduceAmount =
      validItem.length - 1 != i ? reduceAmount * (subtotal / validActualTotal) : reduceAmount - subReduceAmountTotal;
    subReduceAmountTotal += subReduceAmount;
    return {
      ...item,
      subtotal: subtotal - subReduceAmount,
      subReduceAmount
    };
  });
  return {
    ...validSale,
    validItems,
    actualTotal,
    reduceAmount,
    subReduceAmountTotal
  };
}
function matchApply(item: Item, { categoryType, value }) {
  return (
    // 匹配所有商品
    categoryType == CategoryType.ALL ||
    // 匹配单个商品
    (categoryType == CategoryType.GOODS && value == item.goods.id) ||
    // 匹配类目
    (item.categories || ([] as any)).indexOf(value) > -1
  );
}
function satisfyThreshold(preTotal, sale: Sale, items: Item[]) {
  var {
    operator = Operator.OPERATE_PRICE,
    thresholdUnit = ThresholdUnit.THRESHOLD_PRICE,
    amount,
    threshold
  } = sale.rule;
  var type = sale.type;
  var isNoThreshold = sale.type == SaleType.ANY;
  var actualTotal = preTotal;
  var reduceAmount = 0;
  var validItems = [];
  var unvalidItems = [];
  var validActualTotal = items.reduce(
    (total, item) => {
      var isMatch = matchApply(item, sale.apply);
      if (isMatch) {
        validItems.push({
          ...item,
          belonged: true
        });
        return {
          totalPrice: total.totalPrice + item.quantity * item.goods.price,
          totalCount: total.totalCount + item.quantity
        };
      } else {
        unvalidItems.push(item);
        return total;
      }
    },
    { totalPrice: 0, totalCount: 0 }
  );
  return {
    validItems,
    unvalidItems,
    satisfy:
      validItems.length > 0 &&
      (isNoThreshold ||
        (ThresholdUnit.THRESHOLD_COUNT == thresholdUnit
          ? validActualTotal.totalCount >= threshold
          : ThresholdUnit.THRESHOLD_PRICE == thresholdUnit ? validActualTotal.totalPrice >= threshold : true))
  };
}
/**
 * 计算相关数据
 * @param saleType
 */
var calculate = (saleType): CartWithSaleFunc => {
  return (cart: CartWithSale): CartWithSale => {
    var { grossTotal, activities, items } = cart;

    items = filter(items);
    var preTotal = grossTotal;
    var reduceActivities = activities.map(activity => {
      var { sales, chosenSale, type, chooseNone } = activity;
      if (sales[0] && sales[0].type == SaleType.CUSTOM)
        return {
          ...activity
        };
      var validAndNotSales: any[] = sales.map((sale: Sale) => {
        var categoryType = sale.apply.categoryType;
        var reduceAmount = sale.rule.amount;
        var value = sale.apply.value;
        var { validItems, unvalidItems, satisfy } = satisfyThreshold(preTotal, sale, items);

        var result: any = {
          sale,
          validItems,
          unvalidItems,
          satisfy
        };
        return satisfy ? calculateActualTotal(preTotal, result) : result;
      });
      var validSales: ValidSale[] = validAndNotSales.filter(item => item.satisfy);
      var unvalidSales: ValidSale[] = validAndNotSales.filter(item => !item.satisfy);
      // 最佳活动
      var bestSale: ValidSale = validSales.reduce((selectedSale: ValidSale, validSale: ValidSale) => {
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
    return {
      ...cart,
      activities: reduceActivities,
      // 使用最后一个活动的实际总额作为最终总额
      actualTotal: preTotal
    };
  };
};
/**
 * 插件的定义
 * @param type
 */
export var plugin = (type): SalePlugin<CartWithSaleFunc, extActions> => {
  return {
    CONST,
    actions,
    reducer: reducer(type),
    calculate: calculate(type)
  };
};

export { thunk, actions as saleAction, matchApply, satisfyThreshold };
