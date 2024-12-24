export interface OrderRequest {
  item: string;
  quantity: number;
}

export interface OrderStatusRequest {
  id: string;
  status: OrderStatus;
}

export interface OrderById {
  id: string;
}

export interface OrderResponse {
  id: string;
  item: string;
  quantity: number;
  status: OrderStatus;
  location?: {
    lat: number;
    lng: number;
  };
}

export enum OrderStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  PREPARING = 'Preparing',
  COURIER_ON_THE_WAY = 'Courier on the way',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}
