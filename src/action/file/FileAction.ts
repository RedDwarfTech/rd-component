export type fileAction = uploadFileAction | downloadFileAction | fileClearAction | fileRemBgAction;

export enum FileActionType {
    UPLOAD_FILE,
    DOWNLOAD_FILE,
    FILE_CLEAR,
    FILE_REMOVE_BG
}

export interface uploadFileAction {
    type: FileActionType.UPLOAD_FILE;
    data: any;
}

export interface downloadFileAction {
    type: FileActionType.UPLOAD_FILE;
    data: any;
}

export interface fileClearAction {
    type: FileActionType.FILE_CLEAR;
    data: any;
}

export interface fileRemBgAction {
    type: FileActionType.FILE_REMOVE_BG;
    data: any;
}