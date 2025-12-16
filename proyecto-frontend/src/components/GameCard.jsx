import React from 'react';
// 1. ¡Importamos Link!
import { Link } from 'react-router-dom';

function GameCard({ producto }) {

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(producto.precio);

  // 2. Creamos la URL de detalle usando el ID del producto
const detalleUrl = `/productos/${producto._id}`;

  return (
    <div className="producto-card">
      <div 
        className="producto-imagen" 
        style={{ backgroundImage: `url(${producto.imagen})` }}
      ></div>

      <h3>{producto.nombre}</h3>

      <p className="precio">{precioFormateado}</p>

      {/* 3. Reemplazamos el <button> por un <Link> que se VE como un botón.
          Ahora este link SÍ te llevará a la página de detalle. */}
      <Link to={detalleUrl} className="btn-agregar">
        Ver detalle
      </Link>
    </div>
  );
}

export default GameCard;