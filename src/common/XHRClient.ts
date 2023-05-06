import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuid } from 'uuid';
import { RequestHandler, ResponseCode, WheelGlobal } from 'js-wheel';
import { AnyAction, Store } from 'redux';

let isRefreshing = false
let pendingRequestsQueue: Array<any> = [];

const instance = axios.create({
  timeout: 60000
})

instance.defaults.headers.post['Content-Type'] = 'application/json'

export const addRequiredHeaders = (store: Store<any, AnyAction>) => {
  instance.interceptors.request.use((request) => {
    const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
    accessToken && (request.headers['x-access-token'] = accessToken);
    request.headers['x-request-id'] = uuid();
    return request
  },
    (error: any) => {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use((response: AxiosResponse<any, any>) => {
    const originalRequest: InternalAxiosRequestConfig<any> = response.config;
    if (isRefreshing) {
      pendingRequestsQueue.push(originalRequest);
    }
    if (!isRefreshing) {
      if (response.data.resultCode === ResponseCode.ACCESS_TOKEN_EXPIRED
        || response.data.resultCode === ResponseCode.ACCESS_TOKEN_INVALID) {
        pendingRequestsQueue.push(originalRequest);
        isRefreshing = true;
        // refresh the access token
        RequestHandler.handleWebAccessTokenExpire()
          .then((data: any) => {
            isRefreshing = false;
            pendingRequestsQueue.forEach((request) => {
              const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
              request.headers['x-access-token'] = accessToken;
              request.headers['x-request-id'] = uuid();
              instance(request).then((resp: any) => {
                const actionType = response.config.headers['x-action'];
                const data = resp.data.result;
                const action = {
                  type: actionType,
                  data: data
                };
                // change the state to make it render the UI
                store.dispatch(action);
              });
            });
            pendingRequestsQueue = [];
          });
      }
    }
    return response;
  },
    (error: any) => { return Promise.reject(error) }
  )
}

export function requestWithAction(config: any, action: any, store: Store<any, AnyAction>) {
  const actionJson = action({}).type;
  config.headers['x-action'] = actionJson;
  addRequiredHeaders(store);
  return instance(config).then((response: { data: { result: any; }; }) => {
    const data = response.data.result;
    store.dispatch(action(data));
    return response.data;
  }
  ).catch(
    (error: any) => {
      console.error(error);
    }
  );
}

export function requestWithActionType(config: any, actionType: string, store: Store<any, AnyAction>) {
  const generalHeader = {
    'x-action': actionType
  };
  config.headers = Object.assign({}, config.headers, generalHeader);
  addRequiredHeaders(store);
  return instance(config).then((response: { data: { result: any; }; }) => {
    const data = response.data.result;
    const localAction = {
      type: actionType,
      data: data
    };
    store.dispatch(localAction);
    return response.data;
  }
  ).catch((error: any) => {
    console.error(error);
  }
  );
}