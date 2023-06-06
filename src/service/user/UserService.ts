import { UserModel, WheelGlobal } from 'rdjs-wheel';
import { UserActionType } from '@/action/user/UserAction';
import XHRClient from '@/common/XHRClient';
import { AnyAction, Store } from 'redux';

export const UserService = {
    getCurrentUser: (store: Store<any, AnyAction>) => {
        const config = {
            method: 'get',
            url: '/post/user/current-user',
        };
        const actionTypeString: string = UserActionType[UserActionType.GET_CURRENT_USER];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    },
    getCurrUser: (url:string) => {
        const config = {
            method: 'get',
            url: url
        };
        return XHRClient.requestWithoutAction(config);
    },
    userLoginImpl: (params: any, store: Store<any, AnyAction>) => {
        const config = {
            method: 'get',
            url: '/post/alipay/login/getQRCodeUrl',
            params: params
        };
        const actionTypeString: string = UserActionType[UserActionType.USER_LOGIN];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    },
    userLoginByPhoneImpl: (params: any, store: Store<any, AnyAction>, loginUrl: string) => {
        const config = {
            method: 'post',
            url: loginUrl,
            data: JSON.stringify(params)
        };
        const actionTypeString: string = UserActionType[UserActionType.LOGIN_BY_PHONE];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
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
        const uInfo: UserModel = JSON.parse(userInfoJson);
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
    },
    userReg: (params: any, store: Store<any, AnyAction>, regUrl: string) => {
        const config = {
            method: 'post',
            url: regUrl,
            data: JSON.stringify(params)
        };
        const actionTypeString: string = UserActionType[UserActionType.USER_REG];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    }
}

export default UserService;