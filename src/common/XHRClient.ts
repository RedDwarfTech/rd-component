import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { RequestHandler, ResponseCode, WheelGlobal } from 'js-wheel';
import { AnyAction, Store } from 'redux';

let isRefreshing = false
let pendingRequestsQueue: Array<any> = [];

const instance = axios.create({
  timeout: 60000
})

instance.defaults.headers.post['Content-Type'] = 'application/json'

export const XHRClient = {
  requestWithoutAction: async (config: AxiosRequestConfig): Promise<any> => {
    addRequiredHeaders();
    try {
      const response = await instance(config);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
  dispathAction: (data: any, actionType: string, store: Store<any, AnyAction>) => {
    const localAction = {
      type: actionType,
      data: data
    };
    store.dispatch(localAction);
  },
  requestWithActionType: (config: AxiosRequestConfig, actionType: string, store: Store<any, AnyAction>) => {
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
    }).catch((error: any) => {
      console.error(error);
    });
  }
}

export default XHRClient;

export const addRequiredHeaders = (store?: Store<any, AnyAction>) => {
  instance.interceptors.request.use((request) => {
    const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
    accessToken && (request.headers['x-access-token'] = accessToken);
    request.headers['x-request-id'] = uuidv4();
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
              request.headers['x-request-id'] = uuidv4();
              instance(request).then((resp: any) => {
                if (!store) return;
                const actionType = response.config.headers['x-action'];
                if (actionType) {
                  const data = resp.data.result;
                  const action = {
                    type: actionType,
                    data: data
                  };
                  // change the state to make it render the UI
                  store.dispatch(action);
                }
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

export function requestWithAction(config: AxiosRequestConfig, action: any, store: Store<any, AnyAction>) {
  const actionJson = action({}).type;
  const generalHeader = {
    'x-action': actionJson
  };
  config.headers = Object.assign({}, config.headers, generalHeader);
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