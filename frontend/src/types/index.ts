export interface Table {
  tableId: number;
  tableTotalCost: number;
  isTableAvailable: boolean;
  tableWaiter?: {
    employeeId: number;
    employeeName: string;
    employeeSalary: number;
    waiterTables: number;
  };
}

export interface Server {
  employeeId: number;
  employeeName: string;
  employeeSalary: number;
  waiterTables: number;
} 

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
};

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';

export type PaymentMethod = 'cash' | 'credit_card' | 'online';

export type PaymentStatus = 'unpaid' | 'processing' | 'paid' | 'refunded';

export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  menuItemId?: number; // Reference to the original menu item
  status?: OrderStatus; // Individual item status
};

export type Order = {
  id: string;
  items: OrderItem[];
  tableId: number;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
};
