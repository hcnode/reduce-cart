import { Item } from "../interface";
declare function init_cart(data: any): {
    type: string;
    items: any;
};
declare function add(item: Item): {
    product: {
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
    category: string;
    type: string;
};
declare function remove(item: Item): {
    product: {
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
    category: string;
    type: string;
};
declare function update(item: Item): {
    product: {
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
    category: string;
    type: string;
};
declare function throwError(code: number): {
    type: string;
    code: number;
};
export { init_cart, add, remove, update, throwError };
