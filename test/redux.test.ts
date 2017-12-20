import {
  createReducers,
  ActivityPlugin,
  SaleType,
  Sale,
  ValidSale,
  CartWithSale,
  CartWithSaleFunc,
  CategoryType,
  Item,
  Cart,
  SalePlugin,
  actions,
  CONST,
  createCustomPlugin
} from "../";
require("should");
import { items, sales, vouchers } from "./data/data";
import * as redux from "redux";
import { reducerAssert } from "./util";
var reducer;
var activityPlugin;
var voucherPlugin;
before(done => {
  activityPlugin = ActivityPlugin("activity");
  reducer = createReducers([activityPlugin]);
  done();
});
describe("redux", () => {
  var store: redux.Store<any>, state;
  it("#empty data", () => {
    store = redux.createStore(reducer);
    state = store.getState();
    reducerAssert.init(state);
  });

  it("#action: INIT_CART", () => {
    store.dispatch(actions.init_cart(items));
    state = store.getState();
    reducerAssert.init_cart(state);
  });

  it("#action: init_sale", () => {
    store.dispatch(activityPlugin.actions.init_sale(sales, "activity"));
    state = store.getState();
    reducerAssert.init_sale(state);
  });
  it("#action: choose_sale", () => {
    var activity = state.activities[0];
    var { validSales, bestSale } = activity;
    store.dispatch(activityPlugin.actions.choose_sale("3", "activity"));
    state = store.getState();
    reducerAssert.choose_sale(state, validSales, bestSale);
  });
  it("#action: add", () => {
    store.dispatch(
      actions.add({
        product: {
          id: "4",
          name: "item4",
          price: 80
        },
        quantity: 1,
        category: "category3"
      })
    );
    state = store.getState();
    reducerAssert.add(state);
  });

  it("#action: remove", () => {
    store.dispatch(
      actions.remove({
        product: {
          id: "3",
          name: "item3",
          price: 80
        },
        quantity: 1,
        category: "category2"
      })
    );
    state = store.getState();
    reducerAssert.remove(state);
  });
  it("#action: update", () => {
    store.dispatch(
      actions.update({
        product: {
          id: "2",
          name: "item2",
          price: 100
        },
        quantity: 2,
        category: "category1"
      })
    );
    state = store.getState();
    reducerAssert.update(state);
  });
});
