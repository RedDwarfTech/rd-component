export interface Dictionary {
    [key: number]: string;
}

export const orderStatus: Dictionary = {
    0: "待支付",
    1: "已支付",
    2: "已发货",
    3: "已完成",
    4: "已取消",
    5: "已过期"
};