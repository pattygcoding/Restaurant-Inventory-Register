import { MenuItem } from './menu.model';
import { User } from './user.model';

export enum OrderStatus {
  OPEN = 'OPEN',
  PAID = 'PAID',
  VOID = 'VOID'
}

export enum PaymentMethod {
  MOCK_CARD = 'MOCK_CARD',
  CASH = 'CASH',
  OTHER = 'OTHER'
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  size?: string;
  flavor?: string;
  quantity: number;
  basePrice: number;
  lineTotal: number;
  menuItem?: MenuItem;
  toppings?: OrderItemTopping[];
}

export interface OrderItemTopping {
  id: string;
  orderItemId: string;
  toppingItemId: string;
  priceDelta: number;
  toppingItem?: MenuItem;
}

export interface Order {
  id: string;
  userId: string;
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  user?: User;
  orderItems?: OrderItem[];
}

export interface CreateOrderItemRequest {
  menuItemId: string;
  size?: string;
  flavor?: string;
  quantity: number;
  toppings?: string[];
}

export interface CheckoutOrderRequest {
  paymentMethod: PaymentMethod;
  cashTendered?: number;
}

export interface CheckoutOrderResponse {
  order: Order;
  paymentMethod: PaymentMethod;
  change?: number;
  message: string;
}