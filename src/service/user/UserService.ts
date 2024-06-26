import { ResponseHandler, UserModel, WheelGlobal } from 'rdjs-wheel';
import { UserActionType } from '@/action/user/UserAction';
import XHRClient from '@/common/XHRClient';
import { AnyAction, Store } from 'redux';

export const UserService = {
    getCurrentUser: (store: Store<any, AnyAction>) => {
        const config = {
            method: 'get',
            url: '/infra/user/current-user',
        };
        const actionTypeString: string = UserActionType[UserActionType.GET_CURRENT_USER];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    },
    getCurrUser: (url: string) => {
        const config = {
            method: 'get',
            url: url
        };
        return XHRClient.requestWithoutAction(config);
    },
    userLoginImpl: (params: any, store: Store<any, AnyAction>, url: string) => {
        const config = {
            method: 'get',
            url: url,
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
        localStorage.removeItem('base-auth-url');
        localStorage.removeItem('access-token-url-path');
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
    },
    doSendVerifyCode: (params: any, url: string, store: Store<any, AnyAction>) => {
        const config = {
            method: 'post',
            url: url,
            data: JSON.stringify(params)
        };
        const actionTypeString: string = UserActionType[UserActionType.SEND_VERIFY_CODE];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    },
    doResetPwd: (params: any, url: string, store: Store<any, AnyAction>) => {
        const config = {
            method: 'patch',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(params)
        };
        const actionTypeString: string = UserActionType[UserActionType.RESET_PWD];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    },
    doSetNickname: (params: any, url: string, store: Store<any, AnyAction>) => {
        const config = {
            method: 'patch',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(params)
        };
        const actionTypeString: string = UserActionType[UserActionType.SET_NICKNAME];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    },
    getCurrLang: () => {
        const userLanguage = navigator.language;
        const cachedLang = localStorage.getItem('userLanguage');
        const defaultLang = cachedLang ? cachedLang : userLanguage;
        return defaultLang;
    },
    userUnbind: (accountType: number, url: string, store: Store<any, AnyAction>) => {
        const config = {
            method: 'delete',
            url: url + "?accountType=" + accountType
        };
        const actionTypeString: string = UserActionType[UserActionType.USER_UNBIND];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    },
    loadCurrUser: async (force: boolean, url: string): Promise<UserModel> => {
        let userInfo: UserModel = {
            nickname: 'unkown',
            autoRenewProductExpireTimeMs: 0,
            thirdBind: []
        };
        if (force) {
            let data = await UserService.getCurrUser(url);
            if (ResponseHandler.responseSuccess(data)) {
                const uid = data.result.userId;
                if (uid) {
                    localStorage.setItem("userInfo", JSON.stringify(data.result));
                    userInfo = uid;
                }
            }
        } else {
            const uInfo = localStorage.getItem("userInfo");
            if(uInfo){
                return JSON.parse(uInfo);
            }
            let data = await UserService.getCurrUser(url);
            if (ResponseHandler.responseSuccess(data)) {
                const uid = data.result.userId;
                if (uid) {
                    localStorage.setItem("userInfo", JSON.stringify(data.result));
                    userInfo = uid;
                }
            }
        }
        return userInfo;
    }
}

export default UserService;