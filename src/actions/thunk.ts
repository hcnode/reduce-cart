// import {GetCart, GetSales} from '../api'
import {init_cart, add, remove, update, throwError} from './index'
import { CategoryType, Item, Cart, Api } from "../interface";

function isOk(result){
    return result.code == 200;
}
function fetchItems(ctx, api : Api){
    return async dispatch => {
        var result = await api.fetch(ctx);
        if(isOk(result)){
            dispatch(init_cart(result.result))
        }else{
            dispatch(throwError(result.code))
        }
    }
}


/**
 * redux中间件thunk定义
 */
function addItem(ctx, item : Item, api : Api){
    return async dispatch => {
        var result = await api.fetch(ctx);
        if(isOk(result)){
            dispatch(add(item))
        }else{
            dispatch(throwError(result.code))
        }
    }
}

function removeItem(ctx, item : Item, api : Api){
    return async dispatch => {
        var result = await api.fetch(ctx);
        if(isOk(result)){
            dispatch(remove(item))
        }else{
            dispatch(throwError(result.code))
        }
    }
}

function updateItem(ctx, item : Item, api : Api){
    return async dispatch => {
        var result = await api.fetch(ctx);
        if(isOk(result)){
            dispatch(update(item))
        }else{
            dispatch(throwError(result.code))
        }
    }
}

export {fetchItems, addItem, removeItem, updateItem, Api}