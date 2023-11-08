const initState = {
    file: {
    },
    downloadfile: {},
    rembgfile: {}
};

const FileReducer = (state=initState, action: any) => {
    switch (action.type) {
        case "UPLOAD_FILE":
            return {
                ...state,
                file: action.data 
            };
        case "DOWNLOAD_FILE":
            return {
                ...state,
                downloadfile: action.data 
            };
        case "FILE_CLEAR":
            return {
                ...state,
                file: {},
                rembgfile: {},
                downloadfile: {}
            };
        case "FILE_REMOVE_BG":
            return {
                ...state,
                rembgfile: action.data
            }
        default:
            break;
    }
    return state;
};

export default FileReducer;


