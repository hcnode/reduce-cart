import { Item, Api, CheckedItem } from "../interface";
declare function fetchItems(ctx: any, api: Api): (dispatch: any) => Promise<void>;
/**
 * redux中间件thunk定义
 */
declare function addItem(ctx: any, item: Item, api: Api): (dispatch: any) => Promise<void>;
declare function removeItem(ctx: any, item: Item, api: Api): (dispatch: any) => Promise<void>;
declare function updateItem(ctx: any, item: Item, api: Api): (dispatch: any) => Promise<void>;
declare function checkedItem(ctx: any, item: CheckedItem, api: Api): (dispatch: any) => Promise<void>;
export { fetchItems, addItem, removeItem, updateItem, checkedItem };
