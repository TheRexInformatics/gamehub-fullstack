import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';

function GameDetailPage() {
  let { id } = useParams();
  const { addToCart } = useCart();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`${API_URL}/api/games/${id}`);
        if (!res.ok) throw new Error('Juego no encontrado');
        const data = await res.json();
        setGame(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  if (loading) {
    return <main className="producto-detalle"><p>Cargando juego...</p></main>;
  }
  
  if (error) {
    return (
      <main className="producto-detalle">
        <p>Error: {error}</p>
        <Link to="/catalogo" className="btn-volver">← Volver al catálogo</Link>
      </main>
    );
  }
  
  if (!game) {
    return (
      <main className="producto-detalle">
        <p>Juego no encontrado</p>
        <Link to="/catalogo" className="btn-volver">← Volver al catálogo</Link>
      </main>
    );
  }

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(game.precio);

  return (
    <main className="producto-detalle">
      <div className="detalle-container">
        <div className="imagen-producto">
          <img src={game.imagen} alt={game.titulo} />
        </div>
        
        <div className="info-producto">
          <h1>{game.titulo}</h1>
          <p className="precio">{precioFormateado}</p>
          <p className="descripcion">
            {game.descripcion || "Un juego increíble para tu colección gaming."}
          </p>
          
          <div className="caracteristicas">
            <h3>Características</h3>
            <ul>
              <li><strong>Plataforma:</strong> {game.plataforma || "Multiplataforma"}</li>
              <li><strong>Género:</strong> {game.genero || "No especificado"}</li>
              <li><strong>Desarrollador:</strong> {game.desarrollador || "No especificado"}</li>
              <li><strong>Stock:</strong> {game.stock || 1} unidades disponibles</li>
            </ul>
          </div>
          
          <div className="acciones-producto">
            <button 
              className="btn-comprar"
              onClick={() => addToCart(game._id)}
            >
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>

      <Link to="/catalogo" className="btn-volver">
        &larr; Volver al catálogo
      </Link>
    </main>
  );
}

export default GameDetailPage;