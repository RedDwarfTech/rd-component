import { ChatAsk } from "@/models/chat/ChatAsk";
import { AuthHandler, RequestHandler } from "js-wheel";
import { v4 as uuid } from 'uuid';
import { EventSourcePolyfill } from 'event-source-polyfill';

export const SseClientService = {
    doAskPreCheck: (params: ChatAsk, onSseMessage: (msg: string, eventSource: EventSourcePolyfill) => void) => {
        if (AuthHandler.isTokenNeedRefresh(60)) {
            RequestHandler.handleWebAccessTokenExpire()
                .then((data) => {
                    SseClientService.doSseChatAsk(params, onSseMessage);
                });
        } else {
            SseClientService.doSseChatAsk(params, onSseMessage);
        }
    },
    doSseChatAsk: (params: ChatAsk, onSseMessage: (msg: string, eventSource: EventSourcePolyfill) => void) => {
        let eventSource: EventSourcePolyfill;
        const accessToken = localStorage.getItem("x-access-token");
        // https://stackoverflow.com/questions/6623232/eventsource-and-basic-http-authentication
        var queryString = Object.keys(params).map(key => key + '=' + params[key as keyof ChatAsk]).join('&');
        eventSource = new EventSourcePolyfill('/ai/stream/chat/ask?' + queryString, {
            headers: {
                'x-access-token': accessToken ?? "",
                'x-request-id': uuid(),
            }
        });
        eventSource.onopen = () => {

        }
        eventSource.onerror = (error: any) => {
            console.log("onerror", error);
            eventSource.close();
        }
        eventSource.onmessage = e => {
            onSseMessage(e.data, eventSource);
        };
    }
}

export default SseClientService;
