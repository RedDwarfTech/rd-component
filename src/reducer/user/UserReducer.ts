const initState = {
    user: {},
    loginUser: {}
};

const UserReducer = (state=initState, action: any) => {
    switch (action.type) {  
        case "GET_CURRENT_USER":
            return {
                ...state,
                user: action.data 
            };
        case "USER_UNBIND":
            return {
                ...state,
                user: action.data 
            };
        case "LOGIN_BY_PHONE":
            return {
                ...state,
                loginUser: action.data
            };
        case "SET_NICKNAME":
            return {
                ...state,
                loginUser: action.data
            };
        default:
            break;
    }
    return state;
};

export default UserReducer;


