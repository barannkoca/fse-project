import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { MenuItem } from '../types';

const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, cheese, and our special sauce',
    price: 12.99,
    category: 'Main Course',
    image: '/images/burger.jpg'
  },
  {
    id: 2,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons with Caesar dressing',
    price: 9.99,
    category: 'Starters',
    image: '/images/caesar-salad.jpg'
  },
  {
    id: 3,
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 14.99,
    category: 'Main Course',
    image: '/images/pizza.jpg'
  },
  {
    id: 4,
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 6.99,
    category: 'Desserts',
    image: '/images/lava-cake.jpg'
  }
];

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { addItem, items: cartItems, updateQuantity, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(true);

  useEffect(() => {
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:8081/MenuItems');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();

            // Backend -> Frontend tip dönüşümü
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

  fetchMenuItems();
  }, []);

  const handleCheckout = () => {
    navigate('/payment');
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Restaurant Menu</h1>
        <button
          onClick={toggleCart}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90"
        >
          {isCartOpen ? 'Hide Cart' : 'Show Cart'}
          <span className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {cartItems.length}
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu Section - Takes up full width when cart is closed */}
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
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Add to Cart
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section - Takes up 1 column */}
        {isCartOpen && (
          <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Your Cart</CardTitle>
              {cartItems.length === 0 && (
                <CardDescription>Your cart is empty</CardDescription>
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
                        className="h-8 w-8 rounded-md border text-primary-foreground border-gray-200 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-md border text-primary-foreground border-gray-200 flex items-center justify-center"
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
              {cartItems.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
