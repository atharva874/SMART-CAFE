import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food) => {
    if (!food.isAvailable) {
      toast.error('This item is currently unavailable');
      return;
    }

    const existingItem = cartItems.find(item => item._id === food._id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item._id === food._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast.success(`${food.name} quantity updated`);
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
      toast.success(`${food.name} added to cart`);
    }
  };

  const removeFromCart = (foodId) => {
    const item = cartItems.find(item => item._id === foodId);
    setCartItems(cartItems.filter(item => item._id !== foodId));
    toast.info(`${item?.name} removed from cart`);
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity < 1) {
      removeFromCart(foodId);
      return;
    }

    setCartItems(cartItems.map(item =>
      item._id === foodId
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
