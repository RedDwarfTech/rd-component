import { TFunction } from "i18next";

const orderStatusKeys: Record<number, string> = {
  0: "order_status_0",
  1: "order_status_1",
  2: "order_status_2",
  3: "order_status_3",
  4: "order_status_4",
  5: "order_status_5",
};

export function getOrderStatusLabel(status: number, t: TFunction): string {
  const key = orderStatusKeys[status];
  return key ? t(key) : String(status);
}
