// import {GetCart, GetSales} from '../api'
import {init_cart, add, remove, update, checked, throwError, empty, checkedAll} from './index'
import { CategoryType, Item, Cart, Api, ApiItem, ApiActivity, CheckedItem } from "../interface";

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
        var result = await api.add(ctx, item);
        if(isOk(result)){
            dispatch(add(item))
        }else{
            dispatch(throwError(result.code))
        }
    }
}

function removeItem(ctx, item : Item, api : Api){
    return async dispatch => {
        var result = await api.remove(ctx, item);
        if(isOk(result)){
            dispatch(remove(item))
        }else{
            dispatch(throwError(result.code))
        }
    }
}

function updateItem(ctx, item : Item, api : Api){
    return async dispatch => {
        var result = await api.update(ctx, item);
        if(isOk(result)){
            dispatch(update(item))
        }else{
            dispatch(throwError(result.code))
        }
    }
}
function checkedItem(ctx, item : CheckedItem, api : Api){
    return async dispatch => {
        var result = await api.checked(ctx, item);
        if(isOk(result)){
            dispatch(checked(item))
        }else{
            dispatch(throwError(result.code))
        }
    }
}
function checkedAllItems(ctx, api : Api, checked){
    return async dispatch => {
        var result = await api.checkedAll(ctx, checked);
        if(isOk(result)){
            dispatch(checkedAll(checked))
        }else{
            dispatch(throwError(result.code))
        }
    }
}


function emptyItems(ctx, api : Api){
    return async dispatch => {
        var result = await api.empty(ctx);
        if(isOk(result)){
            dispatch(empty())
        }else{
            dispatch(throwError(result.code))
        }
    }
}

export {fetchItems, addItem, removeItem, updateItem, checkedItem, checkedAllItems, emptyItems}