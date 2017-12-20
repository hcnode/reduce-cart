import { Api } from '../../src/actions/thunk';
import { Item } from '../../src/interface';
import { Sale, SaleType, CategoryType } from './../..';
import {items, sales} from './data'
var init_cart : Api = {
    fetch : () => {
        return {
            result : items,
            code : 200
        }
    }
} 
var init_sale : Api = {
    fetch : () => {
        return {
            result : sales,
            code : 200
        }
    }
} 
var add : Api = {
    fetch : () => {
        return {
            result : null,
            code : 200
        }
    }
}

var remove : Api = {
    fetch : () => {
        return {
            result : null,
            code : 200
        }
    }
}

var update : Api = {
    fetch : () => {
        return {
            result : null,
            code : 200
        }
    }
}