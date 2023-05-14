import { useSelector } from "react-redux";
import "./Goods.css"
import { doGetIapProduct } from "@/service/goods/GoodsService";
import { useState } from "react";
import BaseMethods from "js-wheel/dist/src/utils/data/BaseMethods";
import { IapProduct } from "@/models/product/IapProduct";
import { Divider, message } from "antd";
import React from "react";
import { v4 as uuid } from 'uuid';
import { doPay } from "@/service/pay/PayService";
import { AnyAction, Store } from "redux";
import withConnect from "../hoc/withConnect";
import Pay from "../pay/Pay";
import OrderService from "@/service/order/OrderService";
import { RequestHandler, ResponseHandler } from "js-wheel";
import UserService from "@/service/user/UserService";

interface IGoodsProp {
  appId: string;
  store: Store<any, AnyAction>;
  refreshUser?: boolean;
}

const Goods: React.FC<IGoodsProp> = (props: IGoodsProp) => {

  const { iapproducts } = useSelector((state: any) => state.iapproducts);
  const { formText } = useSelector((state: any) => state.pay);
  const [payFrame, setPayFrame] = useState('');
  const [createdOrderInfo, setCreatedOrderInfo] = useState<{ formText: string, orderId: string }>();
  const [products, setProducts] = useState<IapProduct[]>([]);
  const [currentProduct, setCurrentProduct] = useState<IapProduct>();

  React.useEffect(() => {
    getGoods(props.appId);
  }, []);

  React.useEffect(() => {
    if (iapproducts && iapproducts.length > 0) {
      setProducts(iapproducts);
    }
  }, [iapproducts]);

  React.useEffect(() => {
    if (formText && formText.length > 0) {
      setPayFrame(formText);
    }
  }, [formText]);

  const getGoods = (appId: string) => {
    doGetIapProduct(props.store);
  }

  const handlePay = (row: any) => {
    let param = {
      productId: Number(row.id)
    };
    setCurrentProduct(row);
    doPay(param, props.store);
  };

  const productSubMenu = (serverDataSource: IapProduct[]) => {
    if (BaseMethods.isNull(serverDataSource)) {
      return (<div></div>);
    }
    const productSubList: JSX.Element[] = [];
    serverDataSource.sort((a: IapProduct, b: IapProduct) => b.sort - a.sort)
      .forEach((item: IapProduct) => {
        productSubList.push(
          <div key={uuid()} className="package">
            <h2>{item.productTitle}</h2>
            <p className="price">{item.price}<span>元</span></p>
            <ul>
              {vipItems(item.description)}
            </ul>
            <button onClick={() => handlePay(item)}>立即订阅</button>
          </div>);
      });
    return productSubList;
  }

  const vipItems = (items: string) => {
    const parsedItmes = JSON.parse(items);
    if (parsedItmes) {
      const itemList: JSX.Element[] = [];
      parsedItmes.forEach((item: string) => {
        itemList.push(<li key={uuid()}>{item}</li>);
      });
      return itemList;
    }
  }

  const payComplete = () => {
    if (!createdOrderInfo || !createdOrderInfo.orderId) {
      message.error("未找到订单信息");
      return;
    }
    const orderId = createdOrderInfo.orderId;
    OrderService.getOrderStatus(orderId, props.store).then((resp: any) => {
      if (ResponseHandler.responseSuccess(resp)) {
        if (Number(resp.result.orderStatus) === 1) {
          setPayFrame('');
          setCreatedOrderInfo(undefined);
          if (!props.refreshUser) {
            return;
          }
          UserService.getCurrentUser(props.store).then((data: any) => {
            if (ResponseHandler.responseSuccess(data)) {
              localStorage.setItem("userInfo", JSON.stringify(data.result));
              RequestHandler.handleWebAccessTokenExpire();
            }
          });
        } else {
          message.warning("检测到订单当前未支付，请稍后再次确认");
        }
      } else {
        message.warning("订单检测失败");
      }
    });
  }

  return (
    <div>
      <div className="product-container">
        {productSubMenu(products)}
      </div>
      <Divider></Divider>
      <Pay payFormText={payFrame} price={currentProduct?.price!} payProvider={"支付宝"} onPayComplete={payComplete}></Pay>
    </div>
  );
}

Goods.defaultProps = {
  refreshUser: false
}

export default withConnect(Goods);