import React from 'react';
import { Link } from 'react-router-dom';

function GameCard({ producto }) {

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(producto.precio);

  const detalleUrl = `/productos/${producto._id}`;

  return (
    <div className="producto-card">
      <div 
        className="producto-imagen" 
        style={{ backgroundImage: `url(${producto.imagen})` }}
      ></div>

      {/* CAMBIO AQUÍ: producto.nombre → producto.titulo */}
      <h3>{producto.titulo}</h3>

      <p className="precio">{precioFormateado}</p>

      <Link to={detalleUrl} className="btn-agregar">
        Ver detalle
      </Link>
    </div>
  );
}

export default GameCard;