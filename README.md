## 购物车/订单 isomorphic reducer

基于商品和活动、优惠券等数据的购物车相关业务逻辑处理和计算。

## Why

当购物车需求有变化，前端需要改一遍，app端需要改一遍，服务器端也要改一遍，使用这个库可以只需要改一遍，所有端都可以用！

## 特点
* 基于函数式编程的愉快的编程体验
* 基于typescript，可以使用接口的.d.ts类型定义
* vanilla js，没有依赖第三方库
* 可以结合任何库使用，比如react、vue、angular
* 可以使用在任何javascript环境，比如browser、node.js、app、h5

## 例子测试

`git clone https://github.com/hcnode/reduce-cart`

`cd reduce-cart/example`

访问`index.html`

## 使用方法

`npm i reduce-cart`

```javascript
import {ActivityPlugin, createReducers, actions, SaleType, CategoryType} from 'reduce-cart'
// 创建一个活动
var activityPlugin = ActivityPlugin("activity");
// 创建reducer
var reducer = createReducers([activityPlugin]);
var state;
// 初始化商品数据
state = reducer(state, actions.init_cart([
    {
        product : {
            id : '1',
            name : 'item1',
            price : 30
        },
        quantity : 2,
        category : 'category1'
    }
]));
// state == {grossTotal: 60, actualTotal : 60, items : [{id : '1', ...}]}

// 添加一个满50减10的优惠
state = reducer(state, activityPlugin.actions.init_sale({
    id : '1',
    name : 'sale1',
    type : SaleType.THRESHOLD,
    rule : {
        threshold : 50,
        amount : 10
    },
    apply : {
        categoryType : CategoryType.ALL,
        value : ''
    }
}, 'activity'));
// state == {grossTotal: 60, actualTotal : 50, items : [{id : '1', ...}], activities : [{type : 'activity', sales : [{id : '1', ...}]}]}
// 增加一个商品
state = reducer(state, actions.add(
    {
        product : {
            id : '2',
            name : 'item2',
            price : 100
        },
        quantity : 1,
        category : 'category1'
    }
));
// state == {grossTotal: 160, actualTotal : 150, items : [{id : '1', ...}, {id : '2', ...}], ...}

// 更新商品
// state = reducer(state, actions.update(item));

// 删除商品
// state = reducer(state, actions.remove(item));

// 选择活动的规则
// state = reducer(state, activityPlugin.actions.choose_sale(saleId, 'activity'));
```
## state结构

```javascript
interface Cart {
  /**
   * 商品信息，包括数量
   */
  items: Item[];
  /**
   * 活动信息
   */
  activities: Activity[];
  /**
   * 商品总金额
   */
  grossTotal: number;
  /**
   * 实际支付
   */
  actualTotal: number;
}
```

## 其他相关的数据结构

```javascript
// 商品的结构
interface Item {
  /**
   * 商品信息
   */
  product: {
    id: string;
    name: string;
    price: number;
  };
  /**
   * 数量
   */
  quantity: number;
  /**
   * 所属类目
   */
  category: string;
}
// 活动的规则
interface Sale {
    id: string;
    name: string;
    /**
     * 直减还是满减
     */
    type: SaleType;
    /**
     * 规则，满减的额度和减去的金额
     * 
     */
    rule: {
        threshold: number;
        amount: number;
        desc?:string
    };
    /**
     * 应用的商品，限定某个类目还是所有商品
     */
    apply: {
        categoryType: CategoryType;
        value: string;
    };
}
// 活动的规则
interface Activity{
    /**
     * 所有的活动信息
     */
    sales: Sale[];
    /**
     * 当前购物车可用的活动
     */
    validSales: ValidSale[];
    /**
     * 选择的活动
     */
    chosenSale: ValidSale;
    /**
     * 默认活动
     */
    defaultSale: ValidSale;
    /**
     * 最佳活动
     */
    bestSale: ValidSale;
    /**
     * 类型，活动还是优惠券
     */
    type: string;
    /**
     * 上一个支付总额
     */
    preTotal?: number;
    /**
     * 实际支付
     */
    actualTotal?: number;
}
// 可用的活动
interface ValidSale {
    /**
     * 活动对象
     */
    sale: Sale;
    /**
     * 可使用的商品
     */
    validItems: Item[];
    /**
     * 实际支付金额
     */
    actualTotal: number;
    /**
     * 优惠的金额
     */
    reduceAmount: number;
}
/**
 * 优惠类型
 */
enum SaleType {
    /**
     * 直减
     */
    ANY = 1,
    /**
     * 满减
     */
    THRESHOLD = 2,
    /**
     * 自定义
     */
    CUSTOM = 9
}
// 目录类型
enum CategoryType {
    // 限于某个类目
    CATEGORY = 1,
    // 限于某个商品
    GOODS = 2,
    // 所有商品
    ALL = 3
}
```

## 作为redux的reducer例子

```javascript
import {ActivityPlugin, createReducers, actions} from 'reduce-cart'
var activityPlugin = ActivityPlugin("activity");
reducer = createReducers([activityPlugin]);
var store: redux.Store<any>, state;
// 创建store
store = redux.createStore(reducer);
// 使用store的dispatch
store.dispatch(actions.init_cart(items));
```

## 自定义活动规则

```javascript
// 创建免邮活动规则
var shipFreePlugin: SalePlugin<CartWithSaleFunc, extActions> = createCustomPlugin('shipFree', (cart: CartWithSale) => {
    var activities = cart.activities;
    var preTotal = cart.actualTotal;
    var actualTotal = preTotal;
    var reduceActivities = activities.map(activity => {
        // 对当前规则进行运算
        if (activity.type == "shipFree") {
            var sale = activity.sales[0];
            actualTotal = preTotal >= sale.rule.threshold ? preTotal : preTotal + sale.rule.amount;
            // 重新赋值preTotal和actualTotal
            return {
                ...activity,
                preTotal,
                actualTotal
            };
        } else {
            return activity;
        }
    });
    return {
        ...cart,
        activities: reduceActivities,
        actualTotal
    };
});

var reducer = createReducers([activityPlugin, shipFreePlugin]);
var state;
state = reducer(
    state,
    activityPlugin.actions.init_sale(
        [
            {
                rule: {
                    threshold: 200,
                    amount: 6
                },
                type : SaleType.CUSTOM
            }
        ],
        "shipFree"
    )
);
```
