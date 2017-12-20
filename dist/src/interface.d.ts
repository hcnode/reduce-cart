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
    product: {
        id: string;
        name: string;
        price: number;
    };
    /**
     * 数量
     */
    quantity: number;
    /**
     * 所属类目
     */
    category: string;
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
export interface Api {
    fetch(ctx: any): {
        result: any;
        code: number;
    };
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
    thunk: Thunk;
    reducer: T;
    calculate: T;
}
export declare type ActionFunc = (data: any, saleType: string) => redux.AnyAction;
