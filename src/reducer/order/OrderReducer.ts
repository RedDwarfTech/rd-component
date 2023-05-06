
const initState = {
    order: {}
};

const OrderReducer = (state = initState, action: any) => {
    switch (action.type) {
        case "GET_ORDER_STATUS":
            return {
                ...state,
                order: action.data
            };
        default:
            break;
    }
    return state;
};

export default OrderReducer;


