import { useSelector } from "react-redux";
import styles from "./Goods.module.css";
import { doGetIapProduct } from "@/service/goods/GoodsService";
import { useState } from "react";
import { IapProduct } from "@/models/product/IapProduct";
import { toast } from 'react-toastify';
import React from "react";
import { v4 as uuid } from 'uuid';
import PayService from "@/service/pay/PayService";
import { AnyAction, Store } from "redux";
import withConnect from "../hoc/withConnect";
import Pay from "../pay/Pay";
import OrderService from "@/service/order/OrderService";
import { BaseMethods, RequestHandler, ResponseHandler } from "rdjs-wheel";
import UserService from "@/service/user/UserService";
import { IOrder } from "@/models/pay/IOrder";

interface IGoodsProp {
  appId: string;
  store: Store<any, AnyAction>;
  refreshUrl?: string;
  reqUrl?: string;
  lang?: string;
}

const Goods: React.FC<IGoodsProp> = ({ 
  appId,
  store,
  refreshUrl = '',  // 在这里设置默认值
  reqUrl,
  lang
}) => {

  const { iapproducts } = useSelector((state: any) => state.rdRootReducer.iapproduct);
  const { createdOrder } = useSelector((state: any) => state.rdRootReducer.pay);
  const [payFrame, setPayFrame] = useState('');
  const [createdOrderInfo, setCreatedOrderInfo] = useState<IOrder>();
  const [products, setProducts] = useState<IapProduct[]>([]);
  const [currentProduct, setCurrentProduct] = useState<IapProduct>();

  React.useEffect(() => {
    getGoods();
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  React.useEffect(() => {
    if (iapproducts && iapproducts.length > 0) {
      setProducts(iapproducts);
    }
  }, [iapproducts]);

  React.useEffect(() => {
    if (createdOrder && Object.keys(createdOrder).length > 0) {
      setCreatedOrderInfo(createdOrder);
      setPayFrame(createdOrder.formText);
    }
    return () => {
      PayService.doClearAlipayFormText(store);
    }
  }, [createdOrder]);

  const handleOutsideClick = (e: any) => {
    const modal = document.getElementById('pay-popup');
    if (modal && !modal.contains(e.target)) {
      setPayFrame('');
    }
  };

  const getGoods = () => {
    doGetIapProduct(store, lang);
  }

  const handlePay = (row: any) => {
    let param = {
      productId: Number(row.id)
    };
    setCurrentProduct(row);
    PayService.doPay(param, store);
  };

  const productSubMenu = (serverDataSource: IapProduct[]) => {
    if (BaseMethods.isNull(serverDataSource)) {
      return (<div></div>);
    }
    const productSubList: React.JSX.Element[] = [];
    serverDataSource.sort((a: IapProduct, b: IapProduct) => b.sort - a.sort)
      .forEach((item: IapProduct) => {
        productSubList.push(
          <div key={uuid()} className={styles.package}>
            <h2>{item.productTitle}</h2>
            <p className={styles.price}>{item.price}<span>¥</span></p>
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
      const itemList: React.JSX.Element[] = [];
      parsedItmes.forEach((item: string) => {
        itemList.push(<li key={uuid()}>{item}</li>);
      });
      return itemList;
    }
  }

  const payComplete = () => {
    if (!createdOrderInfo || !createdOrderInfo.orderId) {
      toast.error("未找到订单信息");
      return;
    }
    const orderId = createdOrderInfo.orderId;
    OrderService.getOrderStatus(orderId, store).then((resp: any) => {
      if (ResponseHandler.responseSuccess(resp)) {
        if (Number(resp.result.orderStatus) === 1) {
          setPayFrame('');
          setCreatedOrderInfo(undefined);
          if (!refreshUrl || refreshUrl.length === 0) {
            return;
          }
          UserService.loadCurrUser(true, refreshUrl);
          RequestHandler.handleWebAccessTokenExpire();
        } else {
          toast.warning("检测到订单当前未支付，请稍后再次确认");
        }
      } else {
        toast.warning("订单检测失败");
      }
    });
  }

  return (
    <div>
      <div className={styles.container}>
        {productSubMenu(products)}
      </div>
      <div className={styles.goodsDivider}></div>
      <Pay payFormText={payFrame} price={currentProduct?.price!} payProvider={"支付宝"} onPayComplete={payComplete}></Pay>
    </div>
  );
}

export default withConnect(Goods);