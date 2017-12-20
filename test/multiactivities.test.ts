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
  extActions
} from "../";
require("should");
import * as util from './util'
import { items, sales, vouchers } from "./data/data";
var reducer;
var activityPlugin;
var voucherPlugin;
before(done => {
  activityPlugin = ActivityPlugin("activity");
  voucherPlugin = ActivityPlugin("voucher");
  reducer = createReducers([activityPlugin, voucherPlugin]);
  done();
});
describe("muti-activities", () => {
  var state: CartWithSale;
  it("#init data and plugins", () => {
    state = reducer(state, actions.init_cart(items));
    state = reducer(state, activityPlugin.actions.init_sale(sales, "activity"));
    state = reducer(state, voucherPlugin.actions.init_sale(vouchers, "voucher"));
    state.should.be.containDeep({
      activities: [
        {
          sales: Array.from(new Array(5)).map((_, i) => ({
            id: i + 1 + ""
          })),
          defaultSale: { sale: { id: "1" } },
          bestSale: { sale: { id: "1" } },
          preTotal: 240,
          actualTotal: 230,
          type: "activity"
        },
        {
          sales: [{ id: "1" }],
          defaultSale: { sale: { id: "1" } },
          bestSale: { sale: { id: "1" } },
          preTotal: 230,
          actualTotal: 220,
          type: "voucher"
        }
      ],
      grossTotal: 240,
      actualTotal: 220
    });
    state.activities[0].sales.length.should.be.equal(5);
    state.activities[1].sales.length.should.be.equal(2);
    state.activities[0].validSales.length.should.be.equal(3);
    state.activities[1].validSales.length.should.be.equal(1);
  });
  it("#change items", () => {
    state = reducer(
      state,
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
    state.should.be.containDeep({
      activities: [
        {
          sales: Array.from(new Array(5)).map((_, i) => ({
            id: i + 1 + ""
          })),
          defaultSale: { sale: { id: "2" } },
          bestSale: { sale: { id: "2" } },
          preTotal: 340,
          actualTotal: 310,
          type: "activity"
        },
        {
          sales: [{ id: "1" }, { id: "2" }],
          defaultSale: { sale: { id: "2" } },
          bestSale: { sale: { id: "2" } },
          preTotal: 310,
          actualTotal: 290,
          type: "voucher"
        }
      ],
      grossTotal: 340,
      actualTotal: 290
    });
    state.activities[0].sales.length.should.be.equal(5);
    state.activities[1].sales.length.should.be.equal(2);
    state.activities[0].validSales.length.should.be.equal(4);
    state.activities[1].validSales.length.should.be.equal(2);
  });

  it("#plugin", () => {
    var shipFreePlugin: SalePlugin<CartWithSaleFunc, extActions> = util.shipFreePlugin()

    reducer = createReducers([activityPlugin, voucherPlugin, shipFreePlugin]);
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
    
    state.activities.length.should.be.equal(3);
    state.activities[2].should.be.containDeep({
      sales: [{
        rule: {
          threshold: 200,
          amount: 6
        },
        type : SaleType.CUSTOM
      }],
      defaultSale: null,
      chosenSale : null,
      bestSale: null,
      preTotal: 290,
      actualTotal: 290,
      type: "shipFree"
    })
    state = reducer(
      state,
      activityPlugin.actions.init_sale(
        [
          {
            rule: {
              threshold: 500,
              amount: 6
            },
            type : SaleType.CUSTOM
          }
        ],
        "shipFree"
      )
    );
    state.activities[2].should.be.containDeep({
      preTotal: 290,
      actualTotal: 296
    })
  });
});
