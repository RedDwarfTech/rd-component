import { getIapProductsAction } from '@/action/iapproduct/IapProductAction';
import XHRClient from '@/common/XHRClient';
import { AnyAction, Store } from 'redux';

export function doGetIapProduct(store: Store<any, AnyAction>) {
    const config = {
        method: 'get',
        url: '/post/product/v1/list',
        headers: {'Content-Type': 'application/json'}
    };
    return XHRClient.requestWithAction(config, getIapProductsAction,store);
}
