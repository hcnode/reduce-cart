import { Item } from "../interface";
declare function init_cart(data: any): {
    type: string;
    items: any;
};
declare function add(item: Item): {
    goods: {
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
    category: string;
    isBonus?: boolean;
    type: string;
};
declare function remove(item: Item): {
    goods: {
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
    category: string;
    isBonus?: boolean;
    type: string;
};
declare function update(item: Item): {
    goods: {
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
    category: string;
    isBonus?: boolean;
    type: string;
};
declare function throwError(code: number): {
    type: string;
    code: number;
};
export { init_cart, add, remove, update, throwError };
