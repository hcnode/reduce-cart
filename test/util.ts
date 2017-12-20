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
import * as assert from 'assert';
export async function assertThrowsAsync(fn, regExp) {
  let f = () => {};
  try {
    await fn();
  } catch (e) {
    f = () => {
      throw e;
    };
  } finally {
    assert.throws(f, regExp);
  }
}
export function shipFreePlugin(){
  return createCustomPlugin('shipFree', (cart: CartWithSale) => {
    var activities = cart.activities;
    var preTotal = cart.actualTotal;
    var actualTotal = cart.actualTotal;
    var reduceActivities = activities.map(activity => {
      if (activity.type == "shipFree") {
        var sale = activity.sales[0];
        actualTotal = preTotal >= sale.rule.threshold ? preTotal : preTotal + sale.rule.amount;
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
}
var reducerAssert = {
  init : state => {
    state.should.be.deepEqual({
      items: [],
      grossTotal: 0,
      actualTotal: 0,
      error: null,
      activities: []
    });
  },
  init_cart : state => {
    state.should.be.ok;
    state.items.length.should.be.equal(3);
    state.actualTotal.should.be.equal(240);
    state.grossTotal.should.be.equal(240);
  },
  init_sale : state => {
    state.should.be.ok;
    state.items.length.should.be.equal(3);
    state.activities.length.should.be.equal(1);
    var activity = state.activities[0];
    activity.validSales.length.should.be.equal(3);
    activity.validSales.map(validSale => validSale.sale.id).should.be.deepEqual(["1", "3", "4"]);
    activity.validSales
      .find(validSale => validSale.sale.id == "3")
      .validItems.map(item => item.product.id)
      .should.be.deepEqual(["3"]);
    activity.validSales
      .find(validSale => validSale.sale.id == "4")
      .validItems.map(item => item.product.id)
      .should.be.deepEqual(["1", "2"]);
    state.grossTotal.should.be.equal(240);
    state.actualTotal.should.be.equal(230);
    activity.bestSale.sale.id.should.be.equal("1");
    activity.bestSale.actualTotal.should.be.equal(230);
    activity.bestSale.reduceAmount.should.be.equal(10);
    activity.bestSale.validItems.map(item => item.product.id).should.be.deepEqual(["1", "2", "3"]);
    activity.defaultSale.should.deepEqual(activity.bestSale);
  },
  choose_sale : (state, validSales, bestSale) => {
    var activity = state.activities[0];
    activity.validSales.should.be.deepEqual(validSales);
    activity.bestSale.should.be.deepEqual(bestSale);
    activity.chosenSale.should.be.containDeep({
      sale: {
        id: "3"
      },
      actualTotal: 235,
      reduceAmount: 5,
      validItems: [
        {
          product: { id: "3" }
        }
      ]
    });
    state.grossTotal.should.be.equal(240);
    state.actualTotal.should.be.equal(235);
  },
  add : state => {
    state.should.be.containDeep({
      items: Array.from(new Array(4)).map((_, i) => ({
        product: { id: i + 1 + "" }
      })),
      activities: [
        {
          sales: Array.from(new Array(5)).map((_, i) => ({
            id: i + 1 + ""
          })),
          bestSale: {
            sale: { id: "5" },
            reduceAmount: 20,
            actualTotal: 320 - 20,
            validItems: [{ product: { id: "4" } }]
          },
          chosenSale: {
            sale: { id: "3" }
          },
          defaultSale :  {
            sale: { id: "5" }
          },
          actualTotal: 320 - 5
        }
      ],
      grossTotal: 320,
      actualTotal: 320 - 5
    });
  },
  remove : state => {
    state.should.be.containDeep({
      items: [{ product: { id: "1" } }, { product: { id: "2" } }, { product: { id: "4" } }],
      activities: [
        {
          sales: Array.from(new Array(5)).map((_, i) => ({
            id: i + 1 + ""
          })),
          bestSale: {
            sale: { id: "5" },
            reduceAmount: 20,
            actualTotal: 240 - 20,
            validItems: [{ product: { id: "4" } }]
          },
          chosenSale: undefined,
          actualTotal: 240 - 20
        }
      ],
      grossTotal: 240,
      actualTotal: 240 - 20
    });
  },
  update : state => {
    state.should.be.containDeep({
      items: [{ product: { id: "1" } }, { product: { id: "2" } }, { product: { id: "4" } }],
      activities: [
        {
          sales: Array.from(new Array(5)).map((_, i) => ({
            id: i + 1 + ""
          })),
          bestSale: {
            sale: { id: "2" },
            reduceAmount: 30,
            actualTotal: 340 - 30,
            validItems: [{ product: { id: "4" } }]
          },
          actualTotal: 340 - 30,
          defaultSale: {
            sale: { id: "2" }
          },
          chosenSale : undefined
        }
      ],
      grossTotal: 340,
      actualTotal: 340 - 30
    });
  }
}
export {
  reducerAssert
}
