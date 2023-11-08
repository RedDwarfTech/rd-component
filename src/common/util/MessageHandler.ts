import { toast } from 'react-toastify';

export const MessageHandler = {
    send: async (msg: string, type: string): Promise<void> => {
        // https://stackoverflow.com/questions/42218699/chrome-violation-violation-handler-took-83ms-of-runtime
        switch (type) {
            case 'info': {
                await toast.info(msg);
                break;
            }
            case 'success': {
                await toast.success(msg);
                break;
            }
            case 'error': {
                await toast.error(msg);
                break;
            }
            case 'warning': {
                await toast.warning(msg);
                break;
            }
            case 'loading': {
                await toast.loading(msg);
                break;
            }
            default: {
                await toast.info(msg);
                return;
            }
        }
    }
}

export default MessageHandler;