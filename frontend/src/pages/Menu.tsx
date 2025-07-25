import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { MenuItem, Table } from '../types/index';
import { API_ENDPOINTS } from '../config/api';

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showTableDialog, setShowTableDialog] = useState(true);
  const { addItem, items: cartItems, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(true);

  useEffect(() => {
    fetchMenuItems();
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      // Masaları getir
      const tablesResponse = await fetch(API_ENDPOINTS.TABLES.BASE);
      if (!tablesResponse.ok) throw new Error('Failed to fetch tables');
      const tablesData = await tablesResponse.json();

      // Aktif siparişleri getir
      const ordersResponse = await fetch(API_ENDPOINTS.ORDERS.BASE);
      if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
      const ordersData = await ordersResponse.json();

      // Her masa için aktif sipariş kontrolü yap
      const transformed: Table[] = tablesData.map((table: any) => {
        // Masaya ait aktif sipariş var mı kontrol et
        const hasActiveOrder = ordersData.some((order: any) => 
          order.orderTable.tableId === table.tableId && 
          order.orderStatue !== 2 // 2: tamamlandı
        );

        return {
          tableId: table.tableId,
          tableTotalCost: table.tableTotalCost,
          isTableAvailable: !hasActiveOrder && table.tableAvailable, // Hem aktif sipariş yoksa hem de masa müsaitse
          tableWaiter: table.tableWaiter
        };
      });
      
      console.log('İşlenmiş masalar:', transformed);
      setTables(transformed);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8081/MenuItems');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();

      const transformed: MenuItem[] = data.map((item: any) => ({
        id: item.menuItemId,
        name: item.menuItemName,
        description: item.menuItemDesc,
        price: item.menuItemPrice,
        image: item.menuItemPic,
        category: item.menuItemCategory
      }));

      setMenuItems(transformed);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleTableSelect = (tableId: number) => {
    setSelectedTable(tableId);
    setShowTableDialog(false);
  };

  const handleCheckout = async () => {
    if (!selectedTable) {
      alert('Lütfen bir masa seçin');
      return;
    }

    try {
      const orderData = {
        orderTable: {
          tableId: selectedTable
        },
        orderPrice: totalPrice,
        orderStatue: 0, // 0: pending, 1: preparing, 2: completed
        orderMenuItems: cartItems.map(item => ({
          menuItemId: item.menuItem.id
        }))
      };

      const response = await fetch(`${API_ENDPOINTS.ORDERS.BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Sipariş oluşturulamadı');
      }

      const responseData = await response.json();
      console.log('Sipariş başarıyla oluşturuldu:', responseData);

      // Masa durumunu güncelle
      const tableResponse = await fetch(`${API_ENDPOINTS.TABLES.BY_ID(selectedTable)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableId: selectedTable,
          tableTotalCost: Math.round(totalPrice),
          tableAvailable: false,
          tableWaiter: null
        })
      });

      if (!tableResponse.ok) {
        throw new Error('Masa durumu güncellenemedi');
      }

      // Sepeti temizle
      clearCart();
      
      // Ana sayfaya yönlendir
      navigate('/');
    } catch (error) {
      console.error('Sipariş oluşturulurken hata:', error);
      alert('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Masa seçim dialogu
  if (showTableDialog) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <Card className="w-[800px] p-8 bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold mb-2">Masa Seçimi</CardTitle>
            <CardDescription className="text-lg">Lütfen sipariş vermek istediğiniz masayı seçin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {tables.map((table) => (
                <button
                  key={table.tableId}
                  onClick={() => handleTableSelect(table.tableId)}
                  disabled={!table.isTableAvailable}
                  className={`p-6 rounded-xl text-center transition-all duration-200 ${
                    table.isTableAvailable
                      ? 'bg-emerald-100 text-black hover:bg-emerald-200 hover:scale-105 shadow-md border-2 border-emerald-500'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-300'
                  }`}
                >
                  <div className="text-2xl font-bold mb-1">Masa {table.tableId}</div>
                  {!table.isTableAvailable && (
                    <div className="text-sm font-medium">Dolu</div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Restaurant Menu</h1>
          <span className="text-lg text-gray-600">
            Masa {selectedTable}
          </span>
        </div>
        <button
          onClick={toggleCart}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90"
        >
          {isCartOpen ? 'Sepeti Gizle' : 'Sepeti Göster'}
          <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {cartItems.length}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu Section */}
        <div className={isCartOpen ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className={`grid grid-cols-1 ${isCartOpen ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
            {menuItems.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden">
                {item.image && (
                  <div className="relative h-48 w-full">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-medium">${item.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 ml-2">{item.category}</span>
                    </div>
                    <button
                      onClick={() => addItem(item)}
                      className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90"
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        {isCartOpen && (
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Sepetiniz</CardTitle>
                {cartItems.length === 0 && (
                  <CardDescription>Sepetiniz boş</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.menuItem.id} className="flex items-center justify-between space-x-4">
                      <div className="flex-1">
                        <p className="font-medium">{item.menuItem.name}</p>
                        <p className="text-sm text-gray-500">${item.menuItem.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                          className="h-8 w-8 rounded-md border text-black border-gray-200 flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          className="h-8 w-8 rounded-md border text-black border-gray-200 flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.menuItem.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={handleCheckout}
                    className="px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Siparişi Gönder
                  </button>
                  <div className="text-xl font-bold">
                    Toplam: {totalPrice} TL
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
