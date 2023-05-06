import { OrderActionType } from '@/action/order/OrderAction';
import { requestWithActionType } from '@/common/XHRClient';
import { AnyAction, Store } from 'redux';

export const OrderService = {
    getOrderStatus: (orderId: string,store: Store<any, AnyAction>) => {
        const config = {
            method: 'get',
            url: '/post/order/status?orderId=' + orderId,
        };
        const actionTypeString: string = OrderActionType[OrderActionType.GET_ORDER_STATUS];
        return requestWithActionType(config, actionTypeString, store);
    }
}

export default OrderService;