import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  ApiResponse,
  RequestHandler,
  ResponseCode,
  ResponseHandler,
  WheelGlobal,
} from "rdjs-wheel";
import { AnyAction, Store } from "redux";

let isRefreshing = false;
let refreshTimes = 0;
// using hashmap to check the dulplicated request
// avoid flood dulplicate request to server
let pendingRequestsQueue: Map<string, InternalAxiosRequestConfig<any>> = new Map();

const instance = axios.create({
  timeout: 60000,
});

instance.defaults.headers.post["content-type"] = "application/json";
instance.defaults.headers.delete["content-type"] = "application/json";
instance.defaults.headers.put["content-type"] = "application/json";
instance.defaults.headers.patch["content-type"] = "application/json";

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
  dispathAction: (
    data: any,
    actionType: string,
    store: Store<any, AnyAction>
  ) => {
    const localAction = {
      type: actionType,
      data: data,
    };
    store.dispatch(localAction);
  },
  requestWithActionType: (
    config: AxiosRequestConfig,
    actionType: string,
    store: Store<any, AnyAction>
  ): Promise<any> => {
    const generalHeader = {
      "x-action": actionType,
    };
    config.headers = Object.assign({}, config.headers, generalHeader);
    XHRClient.addRequiredHeaders(store);
    return instance(config)
      .then((response: AxiosResponse) => {
        const appResponse: ApiResponse = response.data;
        const data = appResponse.result;
        const success: Boolean = ResponseHandler.responseSuccess(appResponse);
        const dispachType = success ? actionType : "ERROR_BROADCAST";
        const localAction = {
          type: dispachType,
          data: success ? data : appResponse,
        };
        store.dispatch(localAction);
        return appResponse;
      })
      .catch((error: any) => {
        console.error(error);
      });
  },
  handleRefreshTokenExpire(
    response: AxiosResponse<any, any>
  ) {
    if (
      response.data.resultCode === ResponseCode.REFRESH_TOKEN_EXPIRED || 
      response.data.resultCode === ResponseCode.REFRESH_TOKEN_INVALID
    ) {
      window.location.href = "/login";
    }
  },
  handleExpire: (
    response: AxiosResponse<any, any>,
    store?: Store<any, AnyAction>
  ) => {
    const or: InternalAxiosRequestConfig<any> = response.config;
    /**
     * 主要用于判断是否是同一个请求，没有将参数放入key
     * 可能有的时候参数会携带当前时间
     * 这样就没办法避免将同一个请求放入队列中，在Token刷新后反复发送相同的请求
     * 造成请求风暴
     */
    const fullUrl = `${or?.baseURL ?? ""} ${or?.url ?? ""}`;
    if (isRefreshing) {
      if(!pendingRequestsQueue.has(fullUrl)) {
        pendingRequestsQueue.set(fullUrl,or);
      }
    }
    if (!isRefreshing && refreshTimes <= 3) {
      // https://stackoverflow.com/questions/77139090/which-http-code-should-i-choose-when-jwt-token-expired
      if (
        response.data.resultCode === ResponseCode.ACCESS_TOKEN_EXPIRED ||
        response.data.resultCode === ResponseCode.ACCESS_TOKEN_INVALID ||
        response.status == 401 ||
        response.status == 440
      ) {
        if(!pendingRequestsQueue.has(fullUrl)){
          pendingRequestsQueue.set(fullUrl,or);
        }
        isRefreshing = true;
        refreshTimes = refreshTimes + 1;
        // refresh the access token
        RequestHandler.handleWebAccessTokenExpire().then((data: any) => {
          if (!ResponseHandler.responseSuccess(data)) {
            window.location.href = "/user/login";
            return;
          }
          isRefreshing = false;
          refreshTimes = 0;
          pendingRequestsQueue.forEach((request: InternalAxiosRequestConfig<any>,key: string) => {
            const accessToken = localStorage.getItem(
              WheelGlobal.ACCESS_TOKEN_NAME
            );
            request.headers["Authorization"] = "Bearer " + accessToken;
            request.headers["x-request-id"] = uuidv4();
            instance(request).then((resp: any) => {
              if (!store) return;
              const actionType = response.config.headers["x-action"];
              if (actionType) {
                const data = resp.data.result;
                const action = {
                  type: actionType,
                  data: data,
                };
                // change the state to make it render the UI
                store.dispatch(action);
              }
            });
          });
          pendingRequestsQueue.clear();
        });
      }
    }
  },
  requestWithAction: (
    config: AxiosRequestConfig,
    action: any,
    store: Store<any, AnyAction>
  ) => {
    const actionJson = action({}).type;
    const generalHeader = {
      "x-action": actionJson,
    };
    config.headers = Object.assign({}, config.headers, generalHeader);
    XHRClient.addRequiredHeaders(store);
    return instance(config)
      .then((response: { data: { result: any } }) => {
        const data = response.data.result;
        store.dispatch(action(data));
        return response.data;
      })
      .catch((error: any) => {
        console.error(error);
      });
  },
  addRequiredHeaders: (store?: Store<any, AnyAction>) => {
    instance.interceptors.request.use(
      (request) => {
        const accessToken = localStorage.getItem(WheelGlobal.ACCESS_TOKEN_NAME);
        accessToken &&
          (request.headers["Authorization"] = "Bearer " + accessToken);
        request.headers["x-request-id"] = uuidv4();
        return request;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response: AxiosResponse<any, any>) => {
        XHRClient.handleExpire(response, store);
        XHRClient.handleRefreshTokenExpire(response);
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401 || error.response?.status === 440) {
          XHRClient.handleExpire(error.response, store);
        }
        return Promise.reject(error);
      }
    );
  },
};

export default XHRClient;
