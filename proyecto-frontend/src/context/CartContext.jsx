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

  // FUNCIÓN 1: Cargar el conteo inicial
  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartCount(0);
      return;
    }
    
    try {
      // 🔧 CORRECCIÓN: Cambiado de /api/carrito a /api/cart
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { 'x-auth-token': token }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          // Token inválido
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
        }
        setCartCount(0);
        return;
      }
      
      const data = await res.json();
      // El "conteo" es la suma de las "cantidades" de cada item
      const totalItems = data.items ? 
        data.items.reduce((acc, item) => acc + (item.cantidad || 0), 0) : 0;
      setCartCount(totalItems);
    } catch (error) {
      console.error("Error al cargar conteo de carrito:", error);
      setCartCount(0);
    }
  }, []);

  // FUNCIÓN 2: Añadir al carrito
  const addToCart = async (juegoId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para añadir al carrito.');
      navigate('/login');
      return;
    }

    try {
      // 🔧 CORRECCIÓN: Cambiado de /api/carrito/agregar a /api/cart/add
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
        // Si es error 401, redirigir a login
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          navigate('/login');
          return;
        }
        throw new Error(data.error || 'Error al agregar al carrito');
      }

      alert(data.message || 'Juego agregado al carrito');
      
      // Actualizar el conteo
      await fetchCartCount();

    } catch (error) {
      console.error("Error en addToCart:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // FUNCIÓN 3: Limpiar el conteo
  const clearCartCount = () => {
    setCartCount(0);
  };
  
  // 4. Compartir el estado y las funciones
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