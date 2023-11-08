export type orderAction = getOrderStatusAction | getOrderAction | getOrdeListAction;

export enum OrderActionType {
    GET_ORDER_STATUS,
    GET_ORDER,
    GET_ORDER_LIST
}

export interface getOrderStatusAction {
    type: OrderActionType.GET_ORDER_STATUS;
    data: any;
}

export interface getOrderAction {
    type: OrderActionType.GET_ORDER;
    data: any;
}

export interface getOrdeListAction {
    type: OrderActionType.GET_ORDER_LIST;
    data: any;
}