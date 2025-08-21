export enum UserRole {
  CASHIER = 'CASHIER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  password?: string;
  role?: UserRole;
}