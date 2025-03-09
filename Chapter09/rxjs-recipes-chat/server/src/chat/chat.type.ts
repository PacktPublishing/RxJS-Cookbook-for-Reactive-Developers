export interface WsMessage<T> {
  event: string;
  data?: T;
}

export interface Message {
  id: string;
  message: string;
  clientId: string;
  timestamp: Date;
}

export interface ChatEvent {
  clientId: string;
  isTyping: boolean;
}
