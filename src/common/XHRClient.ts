import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse, RequestHandler, ResponseCode, ResponseHandler, WheelGlobal } from 'rdjs-wheel';
import { AnyAction, Store } from 'redux';

let isRefreshing = false;
let refreshTimes = 0;
let pendingRequestsQueue: Array<any> = [];

const instance = axios.create({
  timeout: 60000
})

instance.defaults.headers.post['content-type'] = 'application/json';
instance.defaults.headers.delete['content-type'] = 'application/json';
instance.defaults.headers.put['content-type'] = 'application/json';
instance.defaults.headers.patch['content-type'] = 'application/json';

export const XHRClient = {
  requestWithoutAction: async (config: AxiosRequestConfig): Promise<any> => {
    XHRClient.addRequiredHeaders();
    try {
      const response = await instance(config);
      return response.data;
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
  requestWithActionType: (config: AxiosRequestConfig, actionType: string, store: Store<any, AnyAction>): Promise<any> => {
    const generalHeader = {
      'x-action': actionType
    };
    config.headers = Object.assign({}, config.headers, generalHeader);
    XHRClient.addRequiredHeaders(store);
    return instance(config).then((response: AxiosResponse) => {
      const appResponse: ApiResponse = response.data;
      if (ResponseHandler.responseSuccess(appResponse)) {
        const data = appResponse.result;
        const localAction = {
          type: actionType,
          data: data
        };
        store.dispatch(localAction);
        return appResponse;
      } else {
        return appResponse;
      }
    }).catch((error: any) => {
      console.error(error);
    });
  },
  handleExpire:(response: AxiosResponse<any, any>,store?: Store<any, AnyAction>)=>{
    const originalRequest: InternalAxiosRequestConfig<any> = response.config;
      if (isRefreshing) {
        pendingRequestsQueue.push(originalRequest);
      }
      if (!isRefreshing && refreshTimes <= 3) {
        // https://stackoverflow.com/questions/77139090/which-http-code-should-i-choose-when-jwt-token-expired
        if (response.data.resultCode === ResponseCode.ACCESS_TOKEN_EXPIRED
          || response.data.resultCode === ResponseCode.ACCESS_TOKEN_INVALID
          || response.status == 401 || response.status == 440) {
          pendingRequestsQueue.push(originalRequest);
          isRefreshing = true;
          refreshTimes = refreshTimes + 1;
          // refresh the access token
          RequestHandler.handleWebAccessTokenExpire()
            .then((data: any) => {
              if (!ResponseHandler.responseSuccess(data)) {
                return;
              }
              isRefreshing = false;
              refreshTimes = 0;
              pendingRequestsQueue.forEach((request) => {
                const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
                request.headers['Authorization'] = 'Bearer ' + accessToken;
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
  },
  requestWithAction: (config: AxiosRequestConfig, action: any, store: Store<any, AnyAction>) => {
    const actionJson = action({}).type;
    const generalHeader = {
      'x-action': actionJson
    };
    config.headers = Object.assign({}, config.headers, generalHeader);
    XHRClient.addRequiredHeaders(store);
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
  },
  addRequiredHeaders: (store?: Store<any, AnyAction>) => {
    instance.interceptors.request.use((request) => {
      const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
      accessToken && (request.headers['Authorization'] = 'Bearer ' + accessToken);
      request.headers['x-request-id'] = uuidv4();
      return request
    },
      (error: any) => {
        return Promise.reject(error)
      }
    )

    instance.interceptors.response.use((response: AxiosResponse<any, any>) => {
      XHRClient.handleExpire(response,store);
      return response;
    },
      (error: AxiosError) => {
        if(error.response?.status === 401 || error.response?.status === 440){
          XHRClient.handleExpire(error.response,store);
        }
        return Promise.reject(error)
      }
    )
  }
}

export default XHRClient;