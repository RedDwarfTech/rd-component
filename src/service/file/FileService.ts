import { AxiosRequestConfig } from "axios";
import { RdColor } from "rdjs-wheel";
import { toast } from 'react-toastify';
import { AnyAction, Store } from "redux";
import XHRClient from "@/common/XHRClient";
import { FileActionType } from "@/action/file/FileAction";

export const FileService = {
    doUpload: (params: any, url: string, store: Store<any, AnyAction>) => {
        const config = {
            method: 'post',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(params)
        };
        const actionTypeString: string = FileActionType[FileActionType.UPLOAD_FILE];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    },
    getDownloadFileUrl: (fid: string, bgColor: string, store: Store<any, AnyAction>) => {
        // https://stackoverflow.com/questions/76190591/how-about-to-use-encodeuricomponent-to-encode-key-and-parameter/76190600
        const params = new URLSearchParams({
            id: fid,
            bgColor
        });
        const config = {
            method: 'get',
            url: '/snap/photo/download?' + params,
        };
        const actionTypeString: string = FileActionType[FileActionType.DOWNLOAD_FILE];
        return XHRClient.requestWithActionType(config, actionTypeString, store);
    },
    downloadZipFile: async (params: URLSearchParams): Promise<any> => {
        const config: AxiosRequestConfig = {
            method: 'get',
            responseType: "blob",
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            url: '/snap/photo/download/batch?' + params,
        };
        return await XHRClient.requestWithoutAction(config);
    },
    clearPhoto: (store: Store<any, AnyAction>) => {
        const actionTypeString: string = FileActionType[FileActionType.FILE_CLEAR];
        const action = {
            type: actionTypeString,
            data: null
        };
        store.dispatch(action);
    },
    downloadPhoto: (bgColor: string, imgId: string) => {
        const element = document.getElementById(imgId) as HTMLImageElement;
        if (!element) {
            return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = element.naturalWidth;
        canvas.height = element.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }
        context.imageSmoothingEnabled = true;
        context.drawImage(element as HTMLImageElement, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        if (bgColor !== "origin") {
            const pixelData = imageData.data;
            const rgba = RdColor.colorToRGBA(bgColor);
            if (!rgba) {
                toast.warning("不支持的背景色");
                return;
            }
            const r = rgba[0];
            const g = rgba[1];
            const b = rgba[2];
            for (let i = 0; i < pixelData.length; i += 4) {
                const red = pixelData[i];
                const green = pixelData[i + 1];
                const blue = pixelData[i + 2];
                const alpha = pixelData[i + 3];
                if (red === 0 && green === 0 && blue === 0 && alpha === 0) {
                    pixelData[i] = r;
                    pixelData[i + 1] = g;
                    pixelData[i + 2] = b;
                    pixelData[i + 3] = 255;
                } else if (red < 160 && green < 160 && blue < 160 && alpha === 0) {
                    pixelData[i] = r;
                    pixelData[i + 1] = g;
                    pixelData[i + 2] = b;
                    pixelData[i + 3] = 0;
                }
            }
        }
        context.putImageData(imageData, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'image.png';
        link.click();
    },
    downloadPhotoLegacy: (bgColor: string, imgId: string) => {
        const element = document.getElementById(imgId) as HTMLImageElement;
        if (!element) {
            return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = element.naturalWidth;
        canvas.height = element.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }
        context.imageSmoothingEnabled = true;
        context.drawImage(element as HTMLImageElement, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        if (bgColor !== "origin") {
            context.fillStyle = '#ff0000';
            context.globalCompositeOperation = 'destination-over';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        context.putImageData(imageData, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'image.png';
        link.click();
    },
    saveBase64AsFile: (base64String: string, fileName: string) => {
        const b64toBlob = (b64: string, type: string): Blob => {
            const byteString = atob(b64.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: type });
        }
        const blob = b64toBlob(base64String, 'image/png');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
    }
}

export default FileService;