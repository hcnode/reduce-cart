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
  createCustomPlugin,
  extActions,
  Api
} from "../";
require("should");
import * as util from "./util";
import { items, sales, vouchers } from "./data/data";
import BonusPlugin from "../src/plugins/bonus";
import * as redux from "redux";
import reduxThunk from "redux-thunk";
import { thunk } from "../src/plugins/sale";
var reducer;
var activityPlugin;
var voucherPlugin;
var store: redux.Store<any>;
import { fetchItems, addItem, removeItem, updateItem } from "../src/actions/thunk";
import { reducerAssert } from "./util";
before(done => {
  activityPlugin = ActivityPlugin("activity");
  // voucherPlugin = ActivityPlugin("voucher");
  reducer = createReducers([activityPlugin]);
  store = redux.createStore(reducer, redux.applyMiddleware(reduxThunk));
  done();
});
var activityApi: Api = {
  fetch: async ctx => {
    return {
      code: 200,
      result: sales
    };
  },
  getCartActivities: async ctx => {
    return {
      code: 200,
      result: [{ type: "activity", chooseId: "1" }]
    };
  },
  choose : async (ctx, activity) => {
    return {
      code : 200,
      result : [activity]
    }
  }
};
var itemApi: Api = {
  fetch: async ctx => {
    var goodsList = items.map(item => ({ ...item.goods, categories: item.categories }));
    var cartItems = [{ id: "1", quantity: 1 }, { id: "2", quantity: 2 }];
    return {
      code: 200,
      result: cartItems.map(item => {
        var goods = goodsList.find(goodsItem => goodsItem.id == item.id);
        return {
          goods,
          quantity: item.quantity,
          categories: goods.categories,
          checked : true
        };
      })
    };
  },

  add: async (ctx, item) => {
    return {
      code: 200,
      result: null
    };
  },

  remove: async (ctx, item) => {
    return {
      code: 200,
      result: null
    };
  }
};
describe("thunk", () => {
  var state: CartWithSale;
  it("#fetchItems", async () => {
    await store.dispatch(fetchItems(null, itemApi));
    state = store.getState();
    state.should.be.ok;
    state.items.length.should.be.equal(2);
    state.actualTotal.should.be.equal(230);
    state.grossTotal.should.be.equal(230);
  });
  it("#addItem", async () => {
    await store.dispatch(
      addItem(
        null,
        {
          goods: {
            id: "3",
            name: "item3",
            price: 80
          },
          quantity: 5,
          categories: ['category2']
        },
        itemApi
      )
    );
    state = store.getState();
    state.should.be.ok;
    state.items.length.should.be.equal(3);
    state.actualTotal.should.be.equal(630);
    state.grossTotal.should.be.equal(630);
  });
  it("#removeItem", async () => {
    await store.dispatch(
      removeItem(
        null,
        {
          goods: {
            id: "1",
            name: "item1",
            price: 30
          },
          quantity: 2,
          categories: ['category1']
        },
        itemApi
      )
    );
    state = store.getState();
    state.should.be.ok;
    state.items.length.should.be.equal(2);
    state.actualTotal.should.be.equal(600);
    state.grossTotal.should.be.equal(600);
  });

  it("#fetchSales", async () => {
    await store.dispatch(thunk.fetchSales(null, activityApi, "activity"));
    state = store.getState();
    state.should.be.ok;
    state.items.length.should.be.equal(2);
    state.actualTotal.should.be.equal(590);
    state.grossTotal.should.be.equal(600);
  });

  it("#chooseSale", async () => {
    await store.dispatch(
      thunk.chooseActivity(null, activityApi, "activity", {
        id: "2",
        name: "sale2",
        type: SaleType.THRESHOLD,
        rule: {
          threshold: 330,
          amount: 30
        },
        apply: {
          categoryType: CategoryType.ALL,
          value: ""
        }
      })
    );
    state = store.getState();
    state.should.be.ok;
    state.items.length.should.be.equal(2);
    state.actualTotal.should.be.equal(570);
    state.grossTotal.should.be.equal(600);
  });
});
