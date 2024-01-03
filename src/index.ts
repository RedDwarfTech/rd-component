import CommonPage from "./component/demo/CommonPage";
import Goods from "./component/good/Goods";
import Pay from "./component/pay/Pay";
import rdRootReducer from "./common/combineReducer";
import CommonPageFunction from "./component/demo/CommonPageFunction";
import CommonPageCon from "./component/demo/CommonPageCon";
import withConnect from "./component/hoc/withConnect";
import Footer from "./component/layout/footer/Footer";
import UserProfile from "./component/user/profile/UserProfile";
import { XHRClient } from "./common/XHRClient";
import { userAction, UserActionType } from "./action/user/UserAction";
import { payAction, PayActionType } from "./action/pay/PayAction";
import { IapProduct } from "./models/product/IapProduct";
import { doGetIapProduct } from "./service/goods/GoodsService";
import PayService from "./service/pay/PayService";
import { IOrder } from "./models/pay/IOrder";
import UserService from "./service/user/UserService";
import { IUploadedFile } from "./models/file/IUploadedFile";
import { fileAction, FileActionType } from "./action/file/FileAction";
import MessageHandler from "./common/util/MessageHandler";
import OrderService from "./service/order/OrderService";
import PaySuccess from "./component/pay/success/PaySuccess";
import FileService from "./service/file/FileService";
import SseClientService from "./service/sse/SseClientService";
import { CountryCode } from "./models/common/phone/CountryCode";
import { countryCodes } from "./models/common/phone/CountryCodeDef";
import RdLogin from "./component/user/login/RdLogin";
import RdReg from "./component/user/reg/RdReg";
import { Order } from "./models/order/Order";
import { Dictionary, orderStatus } from "./models/common/enumn/Dictionary";
import { OrderReq } from "./models/order/OrderReq";

export {
    CommonPage,
    Goods,
    Pay,
    PaySuccess,
    rdRootReducer,
    CommonPageFunction,
    CommonPageCon,
    withConnect,
    Footer,
    UserProfile,
    UserActionType,
    PayActionType,
    doGetIapProduct,
    PayService,
    UserService,
    FileService,
    FileActionType,
    MessageHandler,
    OrderService,
    XHRClient,
    SseClientService,
    countryCodes,
    RdLogin,
    RdReg,
    orderStatus
};

export type { 
    userAction, 
    payAction,
    IapProduct,
    IOrder,
    IUploadedFile,
    fileAction,
    CountryCode,
    Order,
    OrderReq,
    Dictionary
 };