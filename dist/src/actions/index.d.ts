import { Item } from "../interface";
declare function init_cart(data: any): {
    type: string;
    items: any;
};
declare function add(item: Item): {
    goods: {
        [key: string]: any;
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
    category: string;
    isBonus?: boolean;
    checked?: boolean;
    belonged?: boolean;
    type: string;
};
declare function remove(item: Item): {
    goods: {
        [key: string]: any;
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
    category: string;
    isBonus?: boolean;
    checked?: boolean;
    belonged?: boolean;
    type: string;
};
declare function update(item: Item): {
    goods: {
        [key: string]: any;
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
    category: string;
    isBonus?: boolean;
    checked?: boolean;
    belonged?: boolean;
    type: string;
};
declare function checked({goodsId, checked}: {
    goodsId: any;
    checked: any;
}): {
    type: string;
    goodsId: any;
    checked: any;
};
declare function checkedAll(checked: any): {
    type: string;
    checked: any;
};
declare function empty(): {
    type: string;
};
declare function removeChecked(): {
    type: string;
};
declare function throwError(code: number): {
    type: string;
    code: number;
};
export { init_cart, add, remove, update, checked, throwError, checkedAll, empty, removeChecked };
