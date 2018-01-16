/**
 * 通用中间件定义
 */
import { CategoryType, Item, Cart, SalePlugin, Actions } from "../interface";
import { Api } from "../interface";
import * as redux from "redux";
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
    };
    /**
     * 应用的商品，限定某个类目还是所有商品
     */
    apply: {
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
     * 实际支付金额
     */
    actualTotal: number;
    /**
     * 优惠的金额
     */
    reduceAmount: number;
}
/**
 * 优惠类型
 */
export declare enum SaleType {
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
    CUSTOM = 9,
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
}
/**
 * 扩展购物车接口
 */
export interface CartWithSale extends Cart {
    activities: Activity[];
}
/**
 * 购物车接口函数
 */
export declare type CartWithSaleFunc = redux.Reducer<CartWithSale>;
export interface extActions extends Actions {
    init_sale: (data: Sale[], saleType: string) => redux.AnyAction;
    choose_sale: (data: string, saleType: string) => redux.AnyAction;
}
/**
 * 活动的action定义
 */
declare var actions: extActions;
declare var thunk: {
    fetchSales: (ctx: any, api: Api, saleType: any) => (dispatch: any) => Promise<void>;
    chooseActivity: (ctx: any, api: Api, saleType: any, sale: any) => (dispatch: any) => Promise<void>;
};
/**
 * 插件的定义
 * @param type
 */
export declare var plugin: (type: any) => SalePlugin<redux.Reducer<CartWithSale>, extActions>;
export { thunk, actions as saleAction };
