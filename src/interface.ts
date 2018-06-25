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
  /**
   * 是否选中
   */
  checked? : boolean
  /**
   * 在validActivity里面的validItems，belonged为true时，属于这个活动
   */
  // belonged? : boolean
  /**
   * 小计
   */
  subtotal?: number;
  /**
   * 小计优惠总和
   */
  subReduceAmount?: number;
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
/**
 * api的返回结果
 */
export type ApiResult = Promise<{
  result: any;
  code: number;
}>
/**
 * 购物车api接口
 */
export interface Api {
  /**
   * 获取购物车数据
   * @param ctx 
   */
  fetch(
    ctx: any
  ): ApiResult;
  /**
   * 购物车添加商品
   * @param ctx 
   * @param item 
   */
  add?(
    ctx: any,
    item : Item
  ): ApiResult;
  /**
   * 购物车更新商品
   * @param ctx 
   * @param item 
   */
  update?(
    ctx: any,
    item : Item
  ): ApiResult;
  /**
   * 购物车删除商品
   * @param ctx 
   * @param item 
   */
  remove?(
    ctx: any,
    item : Item
  ): ApiResult;
  /**
   * 购物车选中商品
   * @param ctx 
   * @param item 
   */
  checked?(
    ctx: any,
    item : CheckedItem
  ): ApiResult;
  /**
   * 购物车全选商品
   * @param ctx 
   * @param checked 
   */
  checkedAll?(
    ctx: any,
    checked : boolean
  ): ApiResult;
  /**
   * 购物车清空商品
   * @param ctx 
   */
  empty?(
    ctx: any
  ): ApiResult;
  /**
   * 购物车删除选中商品
   * @param ctx 
   */
  removeChecked?(
    ctx: any
  ): ApiResult;
  /**
   * 选择活动
   * @param ctx 
   * @param activity 
   */
  choose?(
    ctx: any,
    activity
  ): ApiResult;
  /**
   * 获取购物车活动列表
   * @param ctx 
   */
  getCartActivities?(
    ctx: any
  ): ApiResult;
  /**
   * 不选择任何活动
   * @param ctx 
   * @param activity 
   */
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
/**
 * action
 */
export type ActionFunc = (data: any, saleType: string) => redux.AnyAction;
/**
 * redux的thunk中间件
 */
export type Thunk = {
  [index: string]: ThunkFunc;
}
/**
 * redux的action
 */
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
/**
 * 购物车商品api的item对象
 */
export interface ApiItem {
  id : string,
  quantity : number
}
/**
 * 购物车活动的接口
 */
export interface ApiActivity {
  type : string,
  chooseId : string
}
/**
 * 选中商品参数对象
 */
export interface CheckedItem {goodsId : string, checked : boolean}

