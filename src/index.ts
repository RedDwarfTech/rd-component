import CommonPage from "./component/demo/CommonPage";
import Goods from "./component/good/Goods";
import Pay from "./component/pay/Pay";
import rdRootReducer from "./common/combineReducer";
import CommonPageFunction from "./component/demo/CommonPageFunction";
import CommonPageCon from "./component/demo/CommonPageCon";
import withConnect from "./component/hoc/withConnect";
import store from "./store/store";

export { 
    CommonPage, 
    Goods, 
    Pay, 
    rdRootReducer,
    CommonPageFunction,
    CommonPageCon,
    withConnect,
    store 
}