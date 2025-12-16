import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

function AdminGamesPage() {
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

      <Link to="/admin/games/nuevo" className="admin-btn">
        🎮 Agregar Nuevo Juego
      </Link>

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
                      <img src={game.imagen} alt={game.titulo} style={{width:'60px',height:'60px',objectFit:'cover',borderRadius:'8px',border:'1px solid rgba(0,168,255,0.3)'}} />
                    ) : (
                      <div style={{width:'60px',height:'60px',background:'#0c2461',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',color:'#00a8ff'}}>🎮</div>
                    )}
                  </td>
                  <td>
                    <strong>{game.titulo}</strong>
                    {game.desarrollador && <div style={{fontSize:'12px',color:'#8c9db5'}}>{game.desarrollador}</div>}
                  </td>
                  <td><span style={{background:'rgba(0,168,255,0.2)',color:'#00a8ff',padding:'4px 10px',borderRadius:'12px',fontSize:'11px'}}>{game.plataforma || 'N/A'}</span></td>
                  <td>{game.genero || 'No especificado'}</td>
                  <td style={{color:'#fbc531',fontWeight:'bold'}}>{formatPrice(game.precio)}</td>
                  <td><span style={{color:game.stock>0?'#4cd137':'#e84118',fontWeight:'bold'}}>{game.stock || 0}</span></td>
                  <td>
                    <Link to={`/admin/games/editar/${game._id}`} className="acciones-btn edit-btn">✏️ Editar</Link>
                    <button onClick={() => handleDelete(game._id)} className="acciones-btn delete-btn">🗑️ Eliminar</button>
                    <Link to={`/catalogo/${game._id}`} className="acciones-btn view-btn">👁️ Ver</Link>
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