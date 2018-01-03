import * as React from "react";
import { connect } from "react-redux";
import { items, sales, vouchers } from "../../test/data/data";
import * as util from "../../test/util";
import * as Cart from "../../";
import { Provider } from "react-redux";
import * as redux from "redux";
var activityPlugin = Cart.ActivityPlugin("activity");
var voucherPlugin = Cart.ActivityPlugin("voucher");
var shipFreePlugin = util.shipFreePlugin();
var actions = activityPlugin.actions;

var reducer = Cart.createReducers([activityPlugin, voucherPlugin, shipFreePlugin]);
var store = redux.createStore(reducer);
interface Props extends Cart.CartWithSale {
  addItem: any;
  initSale: any;
  chooseSale: any;
  updateItem: any;
  updateSale: any;
  [key: string]: any;
}
interface State {}
class App extends React.Component<Props, State> {
  state = {};
  initSale() {
    this.props.initSale(sales, "activity");
    this.props.initSale(vouchers, "voucher");
    this.props.initSale(
      [
        {
          id: "shipFree",
          name: "免邮",
          rule: {
            threshold: 300,
            amount: 6,
            desc: "满300免邮"
          },
          type: Cart.SaleType.CUSTOM
        }
      ],
      "shipFree",
      "shipFree"
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
              category: "category1"
            };
            this.props.addItem(newItem);
          }}
        >
          添加商品
        </button>
        <br />
        <br />
        <div>
          购物车商品：
          <table cellPadding="5">
            <tbody>
              <tr>
                <td>商品名</td>
                <td>价格</td>
                <td>数量</td>
                <td>类目</td>
                <td>总额</td>
              </tr>
              {this.props.items.map(item => (
                <tr>
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
                        this.props.updateItem({ ...item, category: e.target.value });
                      }}
                      type="text"
                      value={item.category}
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
                      this.props.initSale(activity.sales.concat(newSale), activity.type);
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
                          : sale.type == Cart.SaleType.THRESHOLD ? "满减" : "自定义";
                      var validSale: Cart.ValidSale = activity.validSales.find(item => item.sale.id == sale.id);
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
                                />减&nbsp;<input
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
                          <td>{validSale ? validSale.validItems.map(item => item.goods.name).join(",") : null}</td>
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
