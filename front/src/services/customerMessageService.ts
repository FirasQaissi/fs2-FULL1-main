import { http, API_BASE } from './http';

const CUSTOMER_MESSAGE_BASE = `${API_BASE}/api/customer-messages`;

export interface CustomerMessageRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface CustomerMessageResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    subject: string;
    createdAt: string;
  };
}

export const customerMessageService = {
  async sendMessage(payload: CustomerMessageRequest): Promise<CustomerMessageResponse> {
    return http<CustomerMessageResponse>(`${CUSTOMER_MESSAGE_BASE}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
