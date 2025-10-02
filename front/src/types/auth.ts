export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin?: boolean;
  isBusiness?: boolean;
  isUser?: boolean;
  createdAt?: string;
  tempAdminExpiry?: string;
  favorites?: string[];
};

export type LoginRequest = {
  isBusiness: boolean | undefined;
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token?: string;
};

export type RegisterRequest = {
  isBusiness: boolean | undefined;
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type RegisterResponse = LoginResponse;


