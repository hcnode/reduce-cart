import * as redux from 'redux';
/**
 * 类目类型
 * @export
 * @enum {number}
 */
export enum CategoryType {
  // 限于某个类目
  CATEGORY = 1,
  // 限于某个商品
  GOODS = 2,
  // 所有商品
  ALL = 3,
  // 活动类目
  ACTIVITY_CATEGORY = 4
}
/**
 * 
 * 错误类型
 * @export
 * @enum {number}
 */
export enum ErrorType {}
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
    [key : string] : any
  };
  /**
   * 数量
   */
  quantity: number;
  /**
   * 所属类目
   */
  category?: string;
  /**
   * 所属类目
   */
  categories?: [string];
  /**
   * 送的
   */
  isBonus? : boolean

  checked? : boolean
  /**
   * 在validActivity里面的validItems，belonged为true时，属于这个活动
   */
  belonged? : boolean
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
export type ApiResult = Promise<{
  result: any;
  code: number;
}>
export interface Api {
  fetch(
    ctx: any
  ): ApiResult;
  add?(
    ctx: any,
    item : Item
  ): ApiResult;
  update?(
    ctx: any,
    item : Item
  ): ApiResult;
  remove?(
    ctx: any,
    item : Item
  ): ApiResult;

  checked?(
    ctx: any,
    item : CheckedItem
  ): ApiResult;

  checkedAll?(
    ctx: any,
    checked : boolean
  ): ApiResult;

  empty?(
    ctx: any
  ): ApiResult;
  
  removeChecked?(
    ctx: any
  ): ApiResult;
  choose?(
    ctx: any,
    activity
  ): ApiResult;
  getCartActivities?(
    ctx: any
  ): ApiResult;
  chooseNone?(
    ctx: any,
    activity
  ): ApiResult;
}
/**
 * thunk接口
 */
export type ThunkFunc = (ctx, api: Api, saleType) => DispatchFunc;
/**
 * dispatch
 */
export type DispatchFunc = (dispatch: Function) => void;
export type Thunk = {
  [index: string]: ThunkFunc;
}
export type Actions = {
  [index: string]: ActionFunc;
}
// reducer中间件
export interface SalePlugin<T, A> {
  CONST: {
    [index: string]: string;
  };
  actions: A;
  reducer: T;
  calculate: T;
}
export type ActionFunc = (data: any, saleType: string) => redux.AnyAction;

export interface ApiItem {
  id : string,
  quantity : number
}

export interface ApiActivity {
  type : string,
  chooseId : string
}
export interface CheckedItem {goodsId : string, checked : boolean}