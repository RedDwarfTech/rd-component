import { message } from "antd";

export const MessageHandler = {
    send: async (msg: string, type: string): Promise<void> => {
        // https://stackoverflow.com/questions/42218699/chrome-violation-violation-handler-took-83ms-of-runtime
        switch (type) {
            case 'info': {
                await message.info(msg);
                break;
            }
            case 'success': {
                await message.success(msg);
                break;
            }
            case 'error': {
                await message.error(msg);
                break;
            }
            case 'warning': {
                await message.warning(msg);
                break;
            }
            case 'loading': {
                await message.loading(msg);
                break;
            }
            default: {
                await message.info(msg);
                return;
            }
        }
    }
}

export default MessageHandler;