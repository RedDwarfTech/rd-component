export interface Dictionary {
    [key: number]: string;
}

 export const orderStatus: Dictionary = {
    0: "待支付",
    1: "已支付",
    2: "已发货"
};