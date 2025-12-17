import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function AdminGamesPage() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/games`);
      const data = await res.json();
      setGames(data);
    } catch (error) {
      console.error("Error al cargar juegos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleDelete = async (gameId) => {
    if (!window.confirm('¿Eliminar este juego?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/games/${gameId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });

      if (!res.ok) throw new Error('Error al eliminar');
      alert('Juego eliminado');
      fetchGames();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div>
      <h1>🎮 Gestión de Juegos</h1>

      <button 
        onClick={() => navigate('/admin/games/nuevo')} 
        className="admin-btn"
      >
        🎮 Agregar Nuevo Juego
      </button>

      <div style={{ height: '20px' }}></div>

      <h2>Catálogo de Juegos</h2>
      
      <div className="search-filter">
        <input type="text" placeholder="🔍 Buscar juegos..." className="search-box" />
        <select className="filter-select">
          <option value="">Todas las plataformas</option>
          <option value="PC">PC</option>
          <option value="PlayStation">PlayStation</option>
          <option value="Xbox">Xbox</option>
          <option value="Nintendo">Nintendo</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Plataforma</th>
              <th>Género</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7">Cargando juegos...</td></tr>
            ) : games.length === 0 ? (
              <tr><td colSpan="7">No hay juegos</td></tr>
            ) : (
              games.map(game => (
                <tr key={game._id}>
                  <td>
                    {game.imagen ? (
                      <img 
                        src={game.imagen} 
                        alt={game.titulo} 
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    ) : (
                      <div>🎮</div>
                    )}
                  </td>
                  <td>
                    <strong>{game.titulo}</strong>
                    {game.desarrollador && (
                      <div>{game.desarrollador}</div>
                    )}
                  </td>
                  <td>{game.plataforma || 'N/A'}</td>
                  <td>{game.genero || 'No especificado'}</td>
                  <td>{formatPrice(game.precio)}</td>
                  <td>{game.stock || 0}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/admin/games/editar/${game._id}`)} 
                      className="acciones-btn edit-btn"
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(game._id)} 
                      className="acciones-btn delete-btn"
                    >
                      🗑️ Eliminar
                    </button>
                    <button 
                      onClick={() => navigate(`/catalogo/${game._id}`)} 
                      className="acciones-btn view-btn"
                    >
                      👁️ Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminGamesPage;