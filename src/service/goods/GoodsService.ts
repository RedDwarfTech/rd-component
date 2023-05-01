import { requestWithAction } from '@/common/XHRClient';
import { ProductReq } from "js-wheel/dist/src/model/product/ProductReq";
import { getIapProductsAction } from '@/action/iapproduct/IapProductAction';
import { AnyAction, Store } from 'redux';

export function doGetIapProduct(store: Store<any, AnyAction>) {
    const config = {
        method: 'get',
        url: '/post/product/v1/list',
        headers: {'Content-Type': 'application/json'}
    };
    return requestWithAction(config, getIapProductsAction,store);
}
