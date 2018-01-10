import * as redux from 'redux';
/**
 * 类目类型
 * @export
 * @enum {number}
 */
export declare enum CategoryType {
    CATEGORY = 1,
    GOODS = 2,
    ALL = 3,
}
/**
 *
 * 错误类型
 * @export
 * @enum {number}
 */
export declare enum ErrorType {
}
/**
 * 商品信息
 *
 * @export
 * @interface Item
 */
export interface Item {
    /**
     * 商品信息
     */
    goods: {
        id: string;
        name: string;
        price: number;
        [key: string]: any;
    };
    /**
     * 数量
     */
    quantity: number;
    /**
     * 所属类目
     */
    category: string;
    /**
     * 送的
     */
    isBonus?: boolean;
    checked?: boolean;
}
/**
 * 购物车
 */
export interface Cart {
    /**
     * 商品信息，包括数量
     */
    items: Item[];
    /**
     * 商品总金额
     */
    grossTotal: number;
    /**
     * 实际支付
     */
    actualTotal: number;
    /**
     * 错误信息
     */
    error: ErrorType;
}
export declare type ApiResult = Promise<{
    result: any;
    code: number;
}>;
export interface Api {
    fetch(ctx: any): ApiResult;
    add?(ctx: any, item: Item): ApiResult;
    update?(ctx: any, item: Item): ApiResult;
    remove?(ctx: any, item: Item): ApiResult;
    checked?(ctx: any, item: CheckedItem): ApiResult;
    choose?(ctx: any, activity: any): ApiResult;
    getCartActivities?(ctx: any): ApiResult;
}
/**
 * thunk接口
 */
export declare type ThunkFunc = (ctx, api: Api, saleType) => DispatchFunc;
/**
 * dispatch
 */
export declare type DispatchFunc = (dispatch: Function) => void;
export declare type Thunk = {
    [index: string]: ThunkFunc;
};
export declare type Actions = {
    [index: string]: ActionFunc;
};
export interface SalePlugin<T, A> {
    CONST: {
        [index: string]: string;
    };
    actions: A;
    reducer: T;
    calculate: T;
}
export declare type ActionFunc = (data: any, saleType: string) => redux.AnyAction;
export interface ApiItem {
    id: string;
    quantity: number;
}
export interface ApiActivity {
    type: string;
    chooseId: string;
}
export interface CheckedItem {
    goodsId: string;
    checked: boolean;
}
