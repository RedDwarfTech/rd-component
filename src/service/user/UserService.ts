import { IUserModel, WheelGlobal } from 'js-wheel';
import { UserActionType } from '@/action/user/UserAction';
import XHRClient, { requestWithActionType } from '@/common/XHRClient';
import { AnyAction, Store } from 'redux';

export const UserService = {
    getCurrentUser: (store: Store<any, AnyAction>) => {
        const config = {
            method: 'get',
            url: '/post/user/current-user',
            headers: { 'Content-Type': 'application/json' }
        };
        const actionTypeString: string = UserActionType[UserActionType.GET_CURRENT_USER];
        return requestWithActionType(config, actionTypeString, store);
    },
    getCurrUser:()=>{
        const config = {
            method: 'get',
            url: '/post/user/current-user'
        };
        return XHRClient.requestWithoutAction(config);
    },
    userLoginImpl: (params: any, store: Store<any, AnyAction>) => {
        const config = {
            method: 'get',
            url: '/post/alipay/login/getQRCodeUrl',
            headers: { 'Content-Type': 'application/json' },
            params: params
        };
        const actionTypeString: string = UserActionType[UserActionType.USER_LOGIN];
        return requestWithActionType(config, actionTypeString, store);
    },
    userLoginByPhoneImpl: (params: any, store: Store<any, AnyAction>) => {
        const config = {
            method: 'post',
            url: '/ai/user/login',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(params)
        };
        const actionTypeString: string = UserActionType[UserActionType.LOGIN_BY_PHONE];
        return requestWithActionType(config, actionTypeString, store);
    },
    isLoggedIn: () => {
        const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
        if (accessToken == null) {
            return false;
        } else {
            return true;
        }
    },
    isSubscribed: (): boolean => {
        const userInfoJson = localStorage.getItem("userInfo");
        if (!userInfoJson) {
            return false;
        }
        const uInfo: IUserModel = JSON.parse(userInfoJson);
        // pay attention that the long data type in the backend server using string to avoid precise loss
        if (uInfo && Number(uInfo.autoRenewProductExpireTimeMs) > new Date().getTime()) {
            return true;
        }
        return false;
    },
    doLoginOut: (logoutUrl: string) => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem(WheelGlobal.ACCESS_TOKEN_NAME);
        localStorage.removeItem(WheelGlobal.REFRESH_TOKEN_NAME);
        localStorage.removeItem('avatarUrl');
        localStorage.removeItem('userInfo');
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'avatarUrl=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = logoutUrl;
    }
}

export default UserService;