import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Order, OrderStatus } from '../types';

// Mock data - replace with real data later
const mockOrders: Order[] = [
  {
    id: '1',
    tableId: 1,
    items: [
      { id: 1, name: 'Classic Burger', quantity: 2, price: 12.99 },
      { id: 2, name: 'Caesar Salad', quantity: 1, price: 8.99 }
    ],
    status: 'pending',
    total: 34.97,
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentStatus: 'unpaid'
  },
  {
    id: '2',
    tableId: 3,
    items: [
      { id: 3, name: 'Margherita Pizza', quantity: 1, price: 14.99 }
    ],
    status: 'preparing',
    total: 14.99,
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentStatus: 'unpaid'
  }
];

const KitchenOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date() }
        : order
    ));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'served': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow: { [key in OrderStatus]: OrderStatus | null } = {
      'pending': 'preparing',
      'preparing': 'ready',
      'ready': 'served',
      'served': 'completed',
      'completed': null,
      'cancelled': null
    };
    return flow[currentStatus];
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Kitchen Order System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-background border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Table {order.tableId}</CardTitle>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="font-medium">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Ordered at {order.createdAt.toLocaleTimeString()}
                    </span>
                    {getNextStatus(order.status) && (
                      <button
                        onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Mark as {getNextStatus(order.status)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KitchenOrder;
