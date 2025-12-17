import React, { createContext, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartCount(0);
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { 'x-auth-token': token }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
        }
        setCartCount(0);
        return;
      }
      
      const data = await res.json();
      const totalItems = data.items ? 
        data.items.reduce((acc, item) => acc + (item.cantidad || 0), 0) : 0;
      setCartCount(totalItems);
    } catch (error) {
      console.error("Error al cargar conteo de carrito:", error);
      setCartCount(0);
    }
  }, []);

  const addToCart = async (juegoId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para añadir al carrito.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ juegoId })
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          navigate('/login');
          return;
        }
        throw new Error(data.error || 'Error al agregar al carrito');
      }

      alert(data.message || '✅ Producto añadido al carrito');
      await fetchCartCount();

    } catch (error) {
      console.error("Error en addToCart:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const clearCartCount = () => {
    setCartCount(0);
  };
  
  const value = {
    cartCount,
    fetchCartCount,
    addToCart,
    clearCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};