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
import * as util from "./util";
import { items, sales, vouchers } from "./data/data";
import BonusPlugin from "../src/plugins/bonus";
import { Operator } from "../src/plugins/sale";
import { ThresholdUnit } from "../dist/src/plugins/sale";
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
        goods: {
          id: "2",
          name: "item2",
          price: 100
        },
        quantity: 2,
        categories: ["category1"]
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
  var shipFreePlugin: SalePlugin<CartWithSaleFunc, extActions>;
  it("#plugin", () => {
    shipFreePlugin = util.shipFreePlugin();

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
            type: SaleType.CUSTOM
          }
        ],
        "shipFree"
      )
    );

    state.activities.length.should.be.equal(3);
    state.activities[2].should.be.containDeep({
      sales: [
        {
          rule: {
            threshold: 200,
            amount: 6
          },
          type: SaleType.CUSTOM
        }
      ],
      defaultSale: null,
      chosenSale: null,
      bestSale: null,
      preTotal: 290,
      actualTotal: 290,
      type: "shipFree"
    });
    state = reducer(
      state,
      activityPlugin.actions.init_sale(
        [
          {
            rule: {
              threshold: 500,
              amount: 6
            },
            type: SaleType.CUSTOM
          }
        ],
        "shipFree"
      )
    );
    state.activities[2].should.be.containDeep({
      preTotal: 290,
      actualTotal: 296
    });
  });

  it("#bonus plugin", () => {
    var bonusPlugin: SalePlugin<CartWithSaleFunc, extActions> = BonusPlugin();

    reducer = createReducers([activityPlugin, voucherPlugin, shipFreePlugin, bonusPlugin]);
    var bonusActivity = [
      {
        rule: {
          bonusId: "3",
          threshold: 2,
          amount: 1,
          operator: Operator.OPERATE_FREE,
          thresholdUnit: ThresholdUnit.THRESHOLD_COUNT
        },
        apply: {
          categoryType: CategoryType.GOODS,
          value: "1"
        },
        type: SaleType.CUSTOM
      },
      {
        rule: {
          bonusId: "9",
          threshold: 290,
          amount: 2,
          operator: Operator.OPERATE_FREE,
          thresholdUnit: ThresholdUnit.THRESHOLD_PRICE
        },
        apply: {
          categoryType: CategoryType.ALL,
          value: ""
        },
        type: SaleType.CUSTOM
      }
    ];
    state = reducer(state, activityPlugin.actions.init_sale(bonusActivity, "bonus"));
    state.activities.length.should.be.equal(4);
    state.activities[3].should.be.containDeep({
      sales: bonusActivity,
      defaultSale: null,
      chosenSale: null,
      bestSale: null,
      type: "bonus"
    });
    state.should.be.containDeep({
      bonusItems: [
        {
          refItems: [{
            goods: {
              id: "1",
              name: "item1",
              price: 30
            },
            quantity: 2,
            categories: ["category1"]
          }],
          count : 1,
          bonusId: "3"
        },
        {
          refItems: [{
            goods: {
              id: "1",
              name: "item1",
              price: 30
            },
            quantity: 2,
            categories: ["category1"]
          }],
          count : 2,
          bonusId: "9"
        }
      ]
    });
  });
});
