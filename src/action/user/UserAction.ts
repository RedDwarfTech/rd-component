export type userAction = loginByPhoneAction | userLoginAction | getCurrentUserAction;

export enum UserActionType {
  LOGIN_BY_PHONE,
  USER_LOGIN,
  GET_CURRENT_USER,
  USER_REG
}

export interface loginByPhoneAction {
  type: UserActionType.LOGIN_BY_PHONE;
  data: any;
}

export interface userLoginAction {
  type: UserActionType.USER_LOGIN;
  data: any;
}

export interface userRegAction {
  type: UserActionType.USER_REG;
  data: any;
}

export interface getCurrentUserAction {
  type: UserActionType.USER_LOGIN;
  data: any;
}