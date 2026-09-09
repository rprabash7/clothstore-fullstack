import { createContext, useContext, useEffect, useState } from 'react';
import {
  addToCart as apiAddToCart,
  clearCart as apiClearCart,
  getCart,
  removeFromCart as apiRemoveFromCart,
  updateCartQuantity as apiUpdateCartQuantity,
} from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const cart = await getCart();
      setCartItems(cart.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (product, quantity = 1, size = 'M') => {
    const cart = await apiAddToCart(product.id, quantity, size);
    setCartItems(cart.items || []);
  };

  const removeFromCart = async (itemId) => {
    const cart = await apiRemoveFromCart(itemId);
    setCartItems(cart.items || []);
  };

  const updateQuantity = async (itemId, quantity) => {
    const cart = await apiUpdateCartQuantity(itemId, quantity);
    setCartItems(cart.items || []);
  };

  const clearCart = async () => {
    const cart = await apiClearCart();
    setCartItems(cart.items || []);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => {
      return count + item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);