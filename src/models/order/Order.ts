export interface Order {
    id: number;
    createdTime: number;
    updatedTime: number; 
    totalPrice: string; 
    appId: string;  
    subject: string;
    orderId: string;
    orderStatus: number;
}