export type userAction = loginByPhoneAction | userLoginAction | getCurrentUserAction | handleUserUnbindAction| setNicknameAction;

export enum UserActionType {
  LOGIN_BY_PHONE,
  USER_LOGIN,
  GET_CURRENT_USER,
  USER_REG,
  SEND_VERIFY_CODE,
  RESET_PWD,
  USER_UNBIND,
  SET_NICKNAME,
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

export interface sendVerifyCodeAction {
  type: UserActionType.SEND_VERIFY_CODE;
  data: any;
}

export interface resetPwdAction {
  type: UserActionType.RESET_PWD;
  data: any;
}

export interface handleUserUnbindAction {
  type: UserActionType.USER_UNBIND;
  data: any;
}

export interface setNicknameAction {
  type: UserActionType.SET_NICKNAME;
  data: any;
}