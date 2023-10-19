
const initState = {
    order: {},
    orderList: [],
};

const OrderReducer = (state = initState, action: any) => {
    switch (action.type) {
        case "GET_ORDER_STATUS":
            return {
                ...state,
                order: action.data
            };
        case "GET_ORDER_LIST":
            return {
                ...state,
                orderList: action.data
            };
        default:
            break;
    }
    return state;
};

export default OrderReducer;


