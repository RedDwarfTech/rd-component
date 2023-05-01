import CommonPage from "./component/demo/CommonPage";
import Goods from "./component/good/Goods";
import Pay from "./component/pay/Pay";
import rdRootReducer from "./common/combineReducer";
import CommonPageFunction from "./component/demo/CommonPageFunction";
import CommonPageCon from "./component/demo/CommonPageCon";
import withConnect from "./component/hoc/withConnect";
import Footer from "./component/layout/footer/Footer";
import UserProfile from "./component/user/profile/UserProfile";
import { requestWithActionType } from "./common/XHRClient";
import { userAction, UserActionType } from "./action/user/UserAction";
import { payAction, PayActionType } from "./action/pay/PayAction";
import { IapProduct } from "./models/product/IapProduct";
import { doGetIapProduct } from "./service/goods/GoodsService";
import PayService, { doPay } from "./service/pay/PayService";
import { IOrder } from "./models/pay/IOrder";
import UserService from "./service/user/UserService";

export {
    CommonPage,
    Goods,
    Pay,
    rdRootReducer,
    CommonPageFunction,
    CommonPageCon,
    withConnect,
    Footer,
    UserProfile,
    requestWithActionType,
    UserActionType,
    PayActionType,
    doGetIapProduct,
    doPay,
    PayService,
    UserService
};

export type { userAction, payAction,IapProduct,IOrder };
