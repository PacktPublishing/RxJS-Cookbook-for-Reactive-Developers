export interface OrderRequest {
    id: string;
    item: string;
    quantity: number;
  }
  
  export interface OrderById {
    id: string;
  }
  
  export interface OrderResponse {
    id: string;
    item: string;
    quantity: number;
    status: string;
  }