import * as React from "react";
import { connect } from "react-redux";
import { items, sales, vouchers, extraSales } from "../../test/data/data";
import * as Cart from "../../";
import { Provider } from "react-redux";
import * as redux from "redux";
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

var activityPlugin = Cart.ActivityPlugin("activity");
var voucherPlugin = Cart.ActivityPlugin("voucher");
var shipFreePlugin: Cart.SalePlugin<Cart.CartWithSaleFunc, Cart.extActions> = Cart.shipFreePlugin();
var bonus: Cart.SalePlugin<Cart.CartWithSaleFunc, Cart.extActions> = Cart.bonusPlugin();

var reducer = Cart.createReducers([activityPlugin, voucherPlugin, shipFreePlugin, bonus]);
var store = redux.createStore(reducer, composeEnhancers && composeEnhancers());
interface Props extends Cart.CartWithSale {
  addItem: any;
  initSale: any;
  chooseSale: any;
  updateItem: any;
  updateSale: any;
  checkedItem: any;
  checkedAll: any;
  empty: any;
  removeChecked: any;
  [key: string]: any;
}
interface State {}
class App extends React.Component<Props, State> {
  state = {};
  initSale() {
    this.props.initSale([...sales, ...extraSales], "activity");
    this.props.initSale(vouchers, "voucher");
    this.props.initSale(
      [
        {
          id: "shipFreeId",
          name: "shipFree",
          rule: {
            threshold: 200,
            amount: 6
          },
          type: Cart.SaleType.CUSTOM,
          apply: {
            categoryType: null,
            value: null
          }
        }
      ],
      "shipFree"
    );

    this.props.initSale(
      [
        {
          id: "bonusId",
          name: "bonus",
          rule: {
            bonusId: "9",
            threshold: 1,
            amount: 1,
            thresholdUnit: Cart.ThresholdUnit.THRESHOLD_COUNT,
            operator: Cart.Operator.OPERATE_COUNT
          },
          type: Cart.SaleType.CUSTOM,
          apply: {
            categoryType: Cart.CategoryType.GOODS,
            value: "3"
          }
        }
      ],
      "bonus"
    );
  }

  render() {
    return (
      <div>
        <button
          onClick={e => {
            for (const item of items) {
              this.props.addItem(item);
            }
          }}
        >
          添加预设的商品
        </button>&nbsp;
        <button
          onClick={e => {
            this.initSale();
          }}
        >
          添加预设的优惠
        </button>&nbsp;
        <button
          onClick={e => {
            var itemLen = this.props.items.length + 1;
            var newItem = {
              goods: {
                id: itemLen + "",
                name: "item" + itemLen,
                price: 100
              },
              quantity: 1,
              categories: ["category1"]
            };
            this.props.addItem(newItem);
          }}
        >
          添加商品
        </button>&nbsp;
        <button
          onClick={e => {
            this.props.removeChecked();
          }}
        >
          删除选中的商品
        </button>&nbsp;
        <button
          onClick={e => {
            this.props.empty();
          }}
        >
          清空所有商品
        </button>
        <br />
        <br />
        <div>
          购物车商品：
          <table cellPadding="5">
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" onChange={e => this.props.checkedAll(e.target.checked)} />
                </td>
                <td>商品名</td>
                <td>价格</td>
                <td>数量</td>
                <td>类目</td>
                <td>总额</td>
              </tr>
              {this.props.items.map(item => (
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={e =>
                        this.props.checkedItem({
                          goodsId: item.goods.id,
                          checked: e.target.checked
                        })
                      }
                    />
                  </td>
                  <td>{item.goods.name}</td>
                  <td>
                    <input
                      onChange={e => {
                        this.props.updateItem({
                          ...item,
                          goods: { ...item.goods, price: parseInt(e.target.value, 10) }
                        });
                      }}
                      type="text"
                      value={item.goods.price}
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td>
                    <input
                      onChange={e => {
                        this.props.updateItem({ ...item, quantity: parseInt(e.target.value, 10) });
                      }}
                      type="text"
                      value={item.quantity}
                      style={{ width: "50px" }}
                    />
                  </td>
                  <td>
                    <input
                      onChange={e => {
                        this.props.updateItem({ ...item, categories: [e.target.value] });
                      }}
                      type="text"
                      value={item.categories[0]}
                      style={{ width: "150px" }}
                    />
                  </td>
                  <td>{item.quantity * item.goods.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          总额：{this.props.items.reduce((total, item) => {
            total += item.quantity * item.goods.price;
            return total;
          }, 0)}
        </div>
        <br />
        <div>
          优惠列表：
          {this.props.activities.map(activity => {
            // 计算下一个优惠的活动
            var nextCloseSaleValidTotal;
            // 从不可用活动里面选出一个最接近的活动
            var nextCloseSale = activity.unvalidSales.reduce((nextCloseSale, unvalidSale) => {
              if (
                (!nextCloseSale ||
                  (nextCloseSale.sale.rule.threshold > unvalidSale.sale.rule.threshold &&
                    unvalidSale.sale.rule.threshold > this.props.grossTotal)) &&
                unvalidSale.sale.rule.amount >
                  (activity.chosenSale || activity.bestSale || { reduceAmount: 0 }).reduceAmount
              ) {
                nextCloseSale = unvalidSale;
              }
              return nextCloseSale;
            }, null);
            // 下一个最接近活动的可用商品的总额
            if (nextCloseSale) {
              nextCloseSaleValidTotal = nextCloseSale.validItems.reduce((total, item) => {
                return total + item.quantity * item.goods.price;
              }, 0);
            }
            return (
              <div>
                <br />
                活动名称：{activity.type} &nbsp;
                {activity.sales.find(sale => sale.type == Cart.SaleType.CUSTOM) ? null : (
                  <button
                    onClick={e => {
                      var saleLen = activity.sales.length + 1;
                      var newSale = {
                        id: saleLen + "",
                        name: "sale" + saleLen,
                        type: Cart.SaleType.THRESHOLD,
                        rule: {
                          threshold: 240,
                          amount: 10
                        },
                        apply: {
                          categoryType: Cart.CategoryType.ALL,
                          value: ""
                        }
                      };
                      this.props.initSale([...activity.sales, newSale], activity.type);
                    }}
                  >
                    添加优惠规则
                  </button>
                )}
                <br />
                活动列表：<table cellPadding="10">
                  <tbody>
                    <tr>
                      <td>名称</td>
                      <td>类型</td>
                      <td>规则</td>
                      <td>应用</td>
                      <td>应用的商品</td>
                      <td>使用</td>
                    </tr>
                    {activity.sales.map(sale => {
                      var type =
                        sale.type == Cart.SaleType.ANY
                          ? "直减"
                          : sale.type == Cart.SaleType.THRESHOLD
                            ? "满减"
                            : "自定义";
                      var validSale: Cart.ValidSale = activity.validSales.find(item => item.sale.id == sale.id);
                      var unvalidSale = !validSale && activity.unvalidSales.find(item => item.sale.id == sale.id);
                      return (
                        <tr>
                          <td>{sale.name}</td>
                          <td>
                            <select
                              onChange={e => {
                                this.props.updateSale(activity.sales, activity.type, {
                                  ...sale,
                                  type: parseInt(e.target.value, 10)
                                });
                              }}
                              value={sale.type}
                            >
                              <option value={Cart.SaleType.ANY}>直减</option>
                              <option value={Cart.SaleType.THRESHOLD}>满减</option>
                              <option value={Cart.SaleType.CUSTOM}>自定义</option>
                            </select>
                          </td>
                          <td>
                            {sale.rule.desc ? (
                              sale.rule.desc
                            ) : (
                              <span>
                                满&nbsp;<input
                                  onChange={e => {
                                    this.props.updateSale(activity.sales, activity.type, {
                                      ...sale,
                                      rule: { ...sale.rule, threshold: parseInt(e.target.value, 10) }
                                    });
                                  }}
                                  type="text"
                                  value={sale.rule.threshold}
                                  style={{ width: "50px" }}
                                />
                                <select
                                  onChange={e => {
                                    this.props.updateSale(activity.sales, activity.type, {
                                      ...sale,
                                      rule: {
                                        ...sale.rule,
                                        thresholdUnit: parseInt(e.target.value, 10)
                                      }
                                    });
                                  }}
                                  value={sale.rule.thresholdUnit || Cart.ThresholdUnit.THRESHOLD_PRICE}
                                >
                                  <option value={Cart.ThresholdUnit.THRESHOLD_COUNT}>个</option>
                                  <option value={Cart.ThresholdUnit.THRESHOLD_PRICE}>元</option>
                                </select>
                                &nbsp;{activity.type == "bonus" ? "送" : "减"}&nbsp;<input
                                  onChange={e => {
                                    this.props.updateSale(activity.sales, activity.type, {
                                      ...sale,
                                      rule: { ...sale.rule, amount: parseInt(e.target.value, 10) }
                                    });
                                  }}
                                  type="text"
                                  value={sale.rule.amount}
                                  style={{ width: "50px" }}
                                />
                                {sale.rule.operator == Cart.Operator.OPERATE_DISCOUNT ? "%" : "元"}
                              </span>
                            )}
                          </td>
                          <td>
                            <select
                              onChange={e => {
                                this.props.updateSale(activity.sales, activity.type, {
                                  ...sale,
                                  apply: { ...sale.apply, categoryType: parseInt(e.target.value, 10) }
                                });
                              }}
                              value={sale.apply.categoryType}
                            >
                              <option value={Cart.CategoryType.ALL}>所有商品</option>
                              <option value={Cart.CategoryType.CATEGORY}>类目</option>
                              <option value={Cart.CategoryType.GOODS}>商品</option>
                            </select>&nbsp;
                            {sale.apply.categoryType == Cart.CategoryType.CATEGORY ? (
                              <span>
                                类目:&nbsp;<input
                                  onChange={e => {
                                    this.props.updateSale(activity.sales, activity.type, {
                                      ...sale,
                                      apply: { ...sale.apply, value: e.target.value }
                                    });
                                  }}
                                  type="text"
                                  value={sale.apply.value}
                                  style={{ width: "150px" }}
                                />
                              </span>
                            ) : sale.apply.categoryType == Cart.CategoryType.GOODS ? (
                              <span>
                                商品:&nbsp;<input
                                  onChange={e => {
                                    this.props.updateSale(activity.sales, activity.type, {
                                      ...sale,
                                      apply: { ...sale.apply, value: e.target.value }
                                    });
                                  }}
                                  type="text"
                                  value={sale.apply.value}
                                  style={{ width: "150px" }}
                                />
                              </span>
                            ) : null}
                          </td>
                          <td>
                            {(validSale || unvalidSale || { validItems: [] as any }).validItems
                              .map(item => item.goods.name)
                              .join(",")}
                          </td>
                          <td>
                            {validSale && validSale.validItems.length > 0 ? (
                              <button
                                onClick={e => {
                                  this.props.chooseSale(sale.id, activity.type);
                                }}
                              >
                                使用
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <br />
                下一个更好优惠：{nextCloseSale
                  ? nextCloseSale.sale.name + "，优惠金额：" + nextCloseSale.sale.rule.amount
                  : "无"}
                <br />
                最佳活动：{activity.bestSale
                  ? activity.bestSale.sale.name + "，优惠金额：" + activity.bestSale.reduceAmount
                  : "无"}
                <br />
                默认活动：{activity.defaultSale
                  ? activity.defaultSale.sale.name + "，优惠金额：" + activity.defaultSale.reduceAmount
                  : "无"}
                <br />
                选中的活动：{activity.chosenSale
                  ? activity.chosenSale.sale.name + "，优惠金额：" + activity.chosenSale.reduceAmount
                  : "无"}
                <br />
                可用的活动:{activity.validSales.map(item => item.sale.name).join(",")}
                <br />
                优惠后总额:{activity.actualTotal}
                <br />
              </div>
            );
          })}
        </div>
        <br />
        买x送x优惠：{this.props.bonusItems
          ? this.props.bonusItems.map(item => {
              return (
                <div>
                  买商品:{item.refItems.map(refItem => refItem.goods.name).join(",")}，送{item.count}个商品id为:{
                    item.bonusId
                  }
                </div>
              );
            })
          : null}
        <br />
        <br />
        <div>最终支付总额：{this.props.actualTotal}</div>
      </div>
    );
  }
}
var Container = connect(
  state => {
    return { ...state };
  },
  dispatch => {
    return {
      addItem: item => {
        dispatch(Cart.actions.add(item));
      },
      updateItem: item => {
        dispatch(Cart.actions.update(item));
      },
      updateSale: (sales: Cart.Sale[], activity, sale: Cart.Sale) => {
        dispatch(activityPlugin.actions.init_sale(sales.map(sale2 => (sale2.id == sale.id ? sale : sale2)), activity));
      },
      initSale: (sales, saleType) => {
        dispatch(activityPlugin.actions.init_sale(sales, saleType));
      },
      chooseSale: (saleId, saleType) => {
        dispatch(activityPlugin.actions.choose_sale(saleId, saleType));
      },
      checkedItem: item => {
        dispatch(Cart.actions.checked(item));
      },
      checkedAll: checked => {
        dispatch(Cart.actions.checkedAll(checked));
      },
      empty: () => {
        dispatch(Cart.actions.empty());
      },
      removeChecked: () => {
        dispatch(Cart.actions.removeChecked());
      }
    };
  }
)(App);

export default () => {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
};
