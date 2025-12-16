import React, { createContext, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

// 1. Creamos el contexto
const CartContext = createContext();

// 2. Creamos un "hook" (atajo) para usar el contexto más fácil
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Creamos el "Proveedor" (el componente que tiene el cerebro)
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // --- FUNCIÓN 1: Cargar el conteo inicial ---
  // (La llamaremos desde el Header cuando el usuario carga la página)
  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartCount(0); // Si no hay token, el carrito es 0
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/api/carrito`, {
        headers: { 'x-auth-token': token }
      });
      if (!res.ok) {
        setCartCount(0); // Si hay error (token viejo), el carrito es 0
        return;
      }
      const data = await res.json(); // data es el array de items
      // El "conteo" es la suma de las "cantidades" de cada item
      const totalItems = data.reduce((acc, item) => acc + item.cantidad, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error("Error al cargar conteo de carrito:", error);
      setCartCount(0);
    }
  }, []);

  // --- FUNCIÓN 2: Añadir al carrito ---
  // (La llamaremos desde ProductDetailPage)
  const addToCart = async (productoId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para añadir al carrito.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/carrito/agregar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ productoId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(data.message); // "Producto añadido al carrito"
      // ¡ÉXITO! Actualizamos el conteo
      fetchCartCount(); // Volvemos a pedir el conteo total al backend

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // --- FUNCIÓN 3: Limpiar el conteo (para el Logout) ---
  const clearCartCount = () => {
    setCartCount(0);
  };
  
  // 4. Compartimos el estado y las funciones con toda la app
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