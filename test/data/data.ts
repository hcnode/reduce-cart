import { Api, Item } from '../../src/interface';
import { Sale, SaleType, CategoryType, Operator, ThresholdUnit } from './../..';
// total: 240
var items : Item[] = [
    {
        goods : {
            id : '1',
            name : 'item1',
            price : 30
        },
        quantity : 2,
        checked : true,
        categories : ['category1']
    },
    {
        goods : {
            id : '2',
            name : 'item2',
            price : 100
        },
        quantity : 1,
        checked : true,
        categories : ['category1']
    },
    {
        goods : {
            id : '3',
            name : 'item3',
            price : 80
        },
        quantity : 1,
        checked : true,
        categories : ['category2']
    },
    {
        goods : {
            id : '8',
            name : 'item8',
            price : 90
        },
        quantity : 1,
        checked : false,
        categories : ['category1']
    }/* ,
    {
        goods : {
            id : '9',
            name : 'item9',
            price : 10
        },
        quantity : 1,
        checked : false,
        categories : ['category1']
    } */
]
var sales : Sale[] = [
    // 满减，所有商品可用
    {
        id : '1',
        name : 'sale1',
        type : SaleType.THRESHOLD,
        rule : {
            threshold : 240,
            amount : 10
        },
        apply : {
            categoryType : CategoryType.ALL,
            value : ''
        }
    },
    // 满减，金额不够，不可用
    {
        id : '2',
        name : 'sale2',
        type : SaleType.THRESHOLD,
        rule : {
            threshold : 330,
            amount : 30
        },
        apply : {
            categoryType : CategoryType.ALL,
            value : ''
        }
    },
    // 某个商品直减,可用
    {
        id : '3',
        name : 'sale3',
        type : SaleType.ANY,
        rule : {
            threshold : -1,
            amount : 5
        },
        apply : {
            categoryType : CategoryType.GOODS,
            value : '3'
        }
    },
    // 某个类别直减，可用
    {
        id : '4',
        name : 'sale4',
        type : SaleType.ANY,
        rule : {
            threshold : -1,
            amount : 6
        },
        apply : {
            categoryType : CategoryType.CATEGORY,
            value : 'category1'
        }
    },
    // 某个类别直减，不可用
    {
        id : '5',
        name : 'sale5',
        type : SaleType.ANY,
        rule : {
            threshold : -1,
            amount :20
        },
        apply : {
            categoryType : CategoryType.CATEGORY,
            value : 'category3'
        }
    }
];
var extraSales : Sale[] = [
    // 满数量打折
    {
        id : '6',
        name : 'sale6',
        type : SaleType.THRESHOLD,
        rule : {
            threshold : 240,
            amount : 10,
            operator : Operator.OPERATE_DISCOUNT
        },
        apply : {
            categoryType : CategoryType.ALL,
            value : ''
        }
    },
    // 满减数量减金额
    {
        id : '7',
        name : 'sale7',
        type : SaleType.THRESHOLD,
        rule : {
            threshold : 5,
            amount : 10,
            thresholdUnit : ThresholdUnit.THRESHOLD_COUNT
        },
        apply : {
            categoryType : CategoryType.CATEGORY,
            value : 'category1'
        }
    }
]
var vouchers : Sale[] = [
    // 满减，所有商品可用
    {
        id : '1',
        name : 'voucher1',
        type : SaleType.THRESHOLD,
        rule : {
            threshold : 200,
            amount : 10
        },
        apply : {
            categoryType : CategoryType.ALL,
            value : ''
        }
    },// 满减，所有商品可用
    {
        id : '2',
        name : 'voucher2',
        type : SaleType.THRESHOLD,
        rule : {
            threshold : 250,
            amount : 20
        },
        apply : {
            categoryType : CategoryType.ALL,
            value : ''
        }
    }
]
export {items, sales, vouchers, extraSales}