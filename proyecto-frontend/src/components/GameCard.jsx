import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function GameCard({ producto }) {
  const { addToCart } = useCart();

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(producto.precio);

  const precioOfertaFormateado = producto.enOferta && producto.precioOferta 
    ? new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
      }).format(producto.precioOferta)
    : null;

  const detalleUrl = `/catalogo/${producto._id}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(producto._id);
  };

  return (
    <div className="producto-card">
      <Link to={detalleUrl} style={{ textDecoration: 'none' }}>
        <div 
          className="producto-imagen" 
          style={{ 
            backgroundImage: `url(${producto.imagen || 'https://via.placeholder.com/300x200/0a0a0f/00ff88?text=GameHub'})`,
            cursor: 'pointer'
          }}
          onError={(e) => {
            e.target.style.backgroundImage = `url('https://via.placeholder.com/300x200/0a0a0f/00ff88?text=🎮+GameHub')`;
          }}
        >
          {producto.enOferta && (
            <div className="badge-active" style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              🔥 OFERTA
            </div>
          )}
        </div>
      </Link>

      <Link to={detalleUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3>{producto.titulo}</h3>
      </Link>

      <div className="precio">
        {producto.enOferta && producto.precioOferta ? (
          <>
            <span style={{ textDecoration: 'line-through', opacity: 0.7, fontSize: '0.9em' }}>
              {precioFormateado}
            </span>
            <span style={{ color: '#ffff00', marginLeft: '10px' }}>
              {precioOfertaFormateado}
            </span>
          </>
        ) : (
          <span>{precioFormateado}</span>
        )}
      </div>

      <button 
        onClick={handleAddToCart} 
        className="btn-agregar"
      >
        🛒 Añadir al carrito
      </button>
    </div>
  );
}

export default GameCard;