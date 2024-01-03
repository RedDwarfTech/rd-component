import { OrderActionType } from '@/action/order/OrderAction';
import { XHRClient } from '@/common/XHRClient';
import { OrderReq } from '@/models/order/OrderReq';
import { AnyAction, Store } from 'redux';

export const OrderService:any = {
    getOrderStatus: (orderId: string,store: Store<any, AnyAction>) => {
        const config = {
            method: 'get',
            url: '/post/order/status?orderId=' + orderId,
        };
        const actionTypeString: string = OrderActionType[OrderActionType.GET_ORDER_STATUS];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    },
    getUserOrderList: (store: Store<any, AnyAction>) => {
        const config = {
            method: 'get',
            url: '/post/order/list',
        };
        const actionTypeString: string = OrderActionType[OrderActionType.GET_ORDER_LIST];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    },
    getUserOrderPage: (store: Store<any, AnyAction>, req: OrderReq) => {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(req)) {
            params.append(key, value);
        }
        const config = {
            method: 'get',
            url: '/post/order/page',
            params: params
        };
        const actionTypeString: string = OrderActionType[OrderActionType.GET_ORDER_PAGE];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    }
}

export default OrderService;