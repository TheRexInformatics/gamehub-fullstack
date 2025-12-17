import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function CarritoPage() {
  const [cart, setCart] = useState({ items: [] });
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
        if (res.status === 401) {
          // Token inválido
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          navigate('/login');
          return;
        }
        
        if (res.status === 404) {
          // Carrito no encontrado (vacío)
          setCart({ items: [] });
          return;
        }
        
        throw new Error('Error al cargar el carrito');
      }
      
      const data = await res.json();
      // Asegurarse de que data tenga la estructura correcta
      setCart(data.items ? data : { items: data || [] });
      
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      setCart({ items: [] });
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
      // 🔧 CORRECCIÓN: La ruta ya es correcta en el backend
      const res = await fetch(`${API_URL}/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          navigate('/login');
          return;
        }
        throw new Error('Error al eliminar item');
      }
      
      alert('Item eliminado del carrito');
      fetchCart(); // Recargar el carrito
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('¿Estás seguro de que quieres vaciar tu carrito?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/cart/clear`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          navigate('/login');
          return;
        }
        throw new Error('Error al vaciar carrito');
      }
      
      setCart({ items: [] });
      alert('Carrito vaciado correctamente');
      
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!userName || !email) {
      alert('Por favor, ingresa tu nombre y email para la orden.');
      return;
    }
    
    if (cart.items.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      // 🔧 CORRECCIÓN: Verificar estructura de datos para el backend
      const orderData = {
        items: cart.items.map(item => ({
          juego: item.juego?._id || item.juego, // Asegurar que sea ObjectId
          cantidad: item.cantidad || 1
        })),
        total: total,
        direccion: "Dirección por definir" // Puedes agregar campo de dirección
      };

      console.log("Enviando orden:", orderData);

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(orderData)
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
        throw new Error(data.error || 'Error al crear orden');
      }

      alert(`¡Orden creada exitosamente! ID: ${data.orderId}\nTotal: ${data.totalFormateado || totalFormateado}`);
      
      // Vaciar carrito después de crear la orden
      await handleClearCart();
      
      // Redirigir a página de inicio o pedidos
      navigate('/home');
      
    } catch (error) {
      console.error("Error en checkout:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Calcular total
  const total = cart.items.reduce((acc, item) => {
    const juego = item.juego || {};
    const precio = juego.precio || 0;
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
        <div className="cart-super-container">
          <div className="loading-message">
            <p>🔄 Cargando tu carrito...</p>
          </div>
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
            {cart.items.length === 0 ? (
              <div className="empty-cart-message">
                <p>🎮 Tu carrito está vacío</p>
                <button 
                  onClick={() => navigate('/catalogo')}
                  className="btn-ver-detalle"
                >
                  Ver Catálogo de Juegos
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Juego</th>
                      <th>Plataforma</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item) => {
                      const juego = item.juego || {};
                      const subtotal = (juego.precio || 0) * (item.cantidad || 1);
                      
                      return (
                        <tr key={item._id}>
                          <td>
                            <div className="cart-item-info">
                              {juego.imagen ? (
                                <img 
                                  src={juego.imagen} 
                                  alt={juego.titulo || 'Juego'} 
                                  className="cart-item-image"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/60x60/0a0a0f/00ff88?text=🎮';
                                  }}
                                />
                              ) : (
                                <div className="game-placeholder">
                                  🎮
                                </div>
                              )}
                              <div className="cart-item-details">
                                <strong>{juego.titulo || 'Juego sin nombre'}</strong>
                                {juego.categoria && (
                                  <div className="game-platform">
                                    {juego.categoria}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="game-platform-badge">
                              {juego.plataforma || 'N/A'}
                            </span>
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
                              title="Eliminar del carrito"
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
            <h3>📋 Resumen de Compra</h3>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Productos ({cart.items.length}):</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span>Gratis 🚚</span>
              </div>
              <div className="summary-row">
                <span>Descuentos:</span>
                <span>$0</span>
              </div>
              <div className="summary-total">
                <span>Total a Pagar:</span>
                <span>{totalFormateado}</span>
              </div>
            </div>
            
            {cart.items.length > 0 && (
              <>
                <button 
                  className="cart-btn vaciar"
                  onClick={handleClearCart}
                  style={{ marginBottom: '15px' }}
                >
                  🗑️ Vaciar Carrito
                </button>
                
                <form onSubmit={handleCheckout} className="checkout-form">
                  <h4>📝 Información para la Orden</h4>
                  
                  <div className="form-group">
                    <label>Nombre completo:</label>
                    <input 
                      type="text" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email de contacto:</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@email.com"
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="cart-btn comprar"
                    disabled={cart.items.length === 0}
                    style={{ marginTop: '15px' }}
                  >
                    🎮 Proceder al Pago
                  </button>
                  
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#8c9db5', 
                    textAlign: 'center',
                    marginTop: '10px'
                  }}>
                    * Esta es una simulación. No se realizarán cargos reales.
                  </p>
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