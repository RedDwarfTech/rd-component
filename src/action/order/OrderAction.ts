export type orderAction = getOrderStatusAction | getOrderAction;

export enum OrderActionType {
    GET_ORDER_STATUS,
    GET_ORDER
}

export interface getOrderStatusAction {
    type: OrderActionType.GET_ORDER_STATUS;
    data: any;
}

export interface getOrderAction {
    type: OrderActionType.GET_ORDER;
    data: any;
}