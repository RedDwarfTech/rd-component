export interface Dictionary {
    [key: number]: string;
}

/** @deprecated 仅含中文文案，请使用 getOrderStatusLabel(status, t) 获取国际化标签 */
export const orderStatus: Dictionary = {
    0: "待支付",
    1: "已支付",
    2: "已发货",
    3: "已完成",
    4: "已取消",
    5: "已过期"
};