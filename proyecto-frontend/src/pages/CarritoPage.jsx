import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function CarritoPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para ver tu carrito.');
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { 'x-auth-token': token }
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          setCart([]);
          return;
        }
        throw new Error('Error al cargar el carrito');
      }
      
      const data = await res.json();
      setCart(data.items || []);
    } catch (error) {
      console.error("Error:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      
      if (!res.ok) throw new Error('Error al eliminar item');
      fetchCart();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('¿Vaciar carrito?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/cart/clear`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      
      if (!res.ok) throw new Error('Error al vaciar carrito');
      setCart([]);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!userName || !email) {
      alert('Ingresa nombre e email');
      return;
    }
    
    if (cart.length === 0) {
      alert('Carrito vacío');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const orderData = {
        items: cart.map(item => ({
          juego: item.juego?._id || item.juego,
          cantidad: item.cantidad
        })),
        total: total,
        direccion: "Dirección por definir"
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al crear orden');
      }

      const orderResult = await res.json();
      alert(`Orden creada: ${orderResult.orderId}`);
      
      handleClearCart();
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const total = cart.reduce((acc, item) => {
    const precio = item.juego?.precio || 0;
    const cantidad = item.cantidad || 1;
    return acc + (precio * cantidad);
  }, 0);

  const totalFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(total);

  if (loading) {
    return (
      <main className="cart-outer">
        <div className="loading-message">
          <p>Cargando carrito...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-outer">
      <div className="cart-super-container">
        <h1>🛒 Mi Carrito</h1>
        <div className="cart-main">
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart-message">
                <p>Tu carrito está vacío</p>
                <button 
                  onClick={() => navigate('/catalogo')}
                  className="btn-ver-detalle"
                >
                  🎮 Ver Juegos
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Juego</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => {
                      const juego = item.juego || {};
                      const subtotal = (juego.precio || 0) * (item.cantidad || 1);
                      
                      return (
                        <tr key={item._id}>
                          <td>
                            <div className="cart-item-info">
                              {juego.imagen ? (
                                <img 
                                  src={juego.imagen} 
                                  alt={juego.titulo} 
                                  className="cart-item-image"
                                />
                              ) : (
                                <div className="game-placeholder">
                                  🎮
                                </div>
                              )}
                              <div className="cart-item-details">
                                <strong>{juego.titulo || 'Juego'}</strong>
                                {juego.plataforma && (
                                  <div className="game-platform">
                                    {juego.plataforma}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="game-price">
                            ${(juego.precio || 0).toLocaleString('es-CL')}
                          </td>
                          <td>
                            <span className="quantity-badge">
                              {item.cantidad || 1}
                            </span>
                          </td>
                          <td className="game-price">
                            ${subtotal.toLocaleString('es-CL')}
                          </td>
                          <td>
                            <button 
                              className="acciones-btn delete-btn"
                              onClick={() => handleRemoveItem(item._id)}
                            >
                              🗑️ Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <aside className="cart-summary">
            <h3>Resumen de Compra</h3>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>{totalFormateado}</span>
              </div>
            </div>
            
            {cart.length > 0 && (
              <>
                <button 
                  className="cart-btn vaciar"
                  onClick={handleClearCart}
                >
                  🗑️ Vaciar Carrito
                </button>
                
                <form onSubmit={handleCheckout} className="checkout-form">
                  <div className="form-group">
                    <label>Nombre para la orden:</label>
                    <input 
                      type="text" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Tu nombre"
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email:</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="cart-btn comprar"
                    disabled={cart.length === 0}
                  >
                    🎮 Proceder al Pago
                  </button>
                </form>
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CarritoPage;