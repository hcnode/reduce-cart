/**
 * action定义
 */
import ACTION from './const'
import { CategoryType, Item, Cart } from "../interface";
function init_cart(data){
    return {
        type: ACTION.INIT_CART,
        items : data
    };
}

function add(item : Item){
    return {
        type: ACTION.ADD,
        ...item
    };
}

function remove(item : Item){
    return {
        type: ACTION.REMOVE,
        ...item
    };
}

function update(item : Item){
    return {
        type: ACTION.UPDATE,
        ...item
    };
}

function checked({goodsId, checked}){
    return {
        type: ACTION.CHECKED,
        goodsId, checked
    };
}

function checkedAll({checked}){
    return {
        type: ACTION.CHECKEDALL,
        checked
    };
}
function empty(){
    return {
        type: ACTION.EMPTY
    };
}
function removeChecked(){
    return {
        type: ACTION.REMOVECHECKED
    };
}
function throwError(code : number){
    return {
        type: ACTION.UPDATE,
        code
    };
}

export {init_cart, add, remove, update, checked, throwError, checkedAll, empty, removeChecked}