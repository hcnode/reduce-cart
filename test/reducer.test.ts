import {
  createReducers,
  ActivityPlugin,
  SaleType,
  Sale,
  ValidSale,
  CartWithSale,
  CategoryType,
  Item,
  Cart,
  SalePlugin,
  actions,
  CONST
} from "../";
require("should");
import { items, sales } from "./data/data";
import {reducerAssert} from './util'
var reducer;
var activityPlugin;
before(done => {
  activityPlugin = ActivityPlugin("activity");
  reducer = createReducers([activityPlugin]);
  done();
});
describe("reducer", () => {
  var state: CartWithSale;
  it("#empty data", () => {
    state = reducer(state, {});
    reducerAssert.init(state);
  });

  it("#action: INIT_CART", () => {
    state = reducer(state, actions.init_cart(items));
    reducerAssert.init_cart(state);
  });
  it("#action: init_sale", () => {
    state = reducer(state, activityPlugin.actions.init_sale(sales, 'activity'));
    reducerAssert.init_sale(state);
  });
  it("#action: CHECKED", () => {
    state = reducer(state, actions.checked({goodsId : '8', checked : true}));
    state.actualTotal.should.be.equal(300);
    state.grossTotal.should.be.equal(330);
    state = reducer(state, actions.checked({goodsId : '8', checked : false}));
    state.actualTotal.should.be.equal(230);
    state.grossTotal.should.be.equal(240);
  });
  it("#action: choose_sale", () => {
    var activity = state.activities[0];
    var { validSales, bestSale } = activity;
    state = reducer(state, activityPlugin.actions.choose_sale("3", 'activity'));
    reducerAssert.choose_sale(state, validSales, bestSale);
  });
  it("#action: add", () => {
    state = reducer(
      state,
      actions.add({
        goods: {
          id: "4",
          name: "item4",
          price: 80
        },
        quantity: 1,
        category: "category3"
      })
    );
    reducerAssert.add(state)
  });

  it("#action: remove", () => {
    state = reducer(
      state,
      actions.remove({
        goods: {
          id: "3",
          name: "item3",
          price: 80
        },
        quantity: 1,
        category: "category2"
      })
    );
    reducerAssert.remove(state)
  });
  it("#action: update", () => {
    state = reducer(
      state,
      actions.update({
        goods: {
          id: "2",
          name: "item2",
          price: 100
        },
        quantity: 2,
        category: "category1"
      })
    );
    reducerAssert.update(state)
  });
  it("#满减和指定类目", () => {
    state = reducer(
      state,
      activityPlugin.actions.init_sale(
        sales.concat({
          id: "6",
          name: "sale6",
          type: SaleType.THRESHOLD,
          rule: {
            threshold: 250,
            amount: 9
          },
          apply: {
            categoryType: CategoryType.CATEGORY,
            value: "category1"
          }
        }), 'activity'
      )
    );
    state.should.be.containDeep({
      activities : [
          {
            sales: Array.from(new Array(6)).map((_, i) => ({
                id: i + 1 + ""
              }))
          }
      ]
    });
    state.activities[0].validSales.find(validSale => validSale.sale.id == "6").should.be.containDeep({
      sale: { id: "6" },
      reduceAmount: 9,
      actualTotal: 340 - 9,
      validItems: [{ goods: { id: "1" } }, { goods: { id: "2" } }]
    });
    state = reducer(
      state,
      activityPlugin.actions.init_sale(
        sales.concat({
          id: "6",
          name: "sale6",
          type: SaleType.THRESHOLD,
          rule: {
            threshold: 261,
            amount: 9
          },
          apply: {
            categoryType: CategoryType.CATEGORY,
            value: "category1"
          }
        }), 'activity'
      )
    );
    state.activities[0].validSales.should.be.not.containDeep([
      {
        sale : { id: "6" }
      }
    ]);

    state = reducer(
      state,
      activityPlugin.actions.init_sale(
        sales.concat({
          id: "6",
          name: "sale6",
          type: SaleType.THRESHOLD,
          rule: {
            threshold: 199,
            amount: 9
          },
          apply: {
            categoryType: CategoryType.GOODS,
            value: "2"
          }
        }), 'activity'
      )
    );
    state.activities[0].validSales.should.be.containDeep([
      {
        sale: { id: "6" }
      }
    ]);

    state = reducer(
      state,
      activityPlugin.actions.init_sale(
        sales.concat({
          id: "6",
          name: "sale6",
          type: SaleType.THRESHOLD,
          rule: {
            threshold: 201,
            amount: 9
          },
          apply: {
            categoryType: CategoryType.GOODS,
            value: "2"
          }
        }), 'activity'
      )
    );
    state.activities[0].validSales.should.be.not.containDeep([
      {
        sale: { id: "6" }
      }
    ]);
  });

  it("#满减和所有商品", () => {
    state = reducer(
      state,
      activityPlugin.actions.init_sale(
        sales.concat({
          id: "6",
          name: "sale6",
          type: SaleType.ANY,
          rule: {
            threshold: -1,
            amount: 6
          },
          apply: {
            categoryType: CategoryType.ALL,
            value: ""
          }
        }), 'activity'
      )
    );
    state.activities[0].validSales.should.be.containDeep([
      {
        sale: { id: "6" }
      }
    ]);
  });
});
