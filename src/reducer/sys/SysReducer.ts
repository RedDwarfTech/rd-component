
const initState = {
    errors: {},
};

const SysReducer = (state = initState, action: any) => {
    switch (action.type) {
        case "ERROR_BROADCAST":
            return {
                ...state,
                errors: action.data
            };
        default:
            break;
    }
    return state;
};

export default SysReducer;


