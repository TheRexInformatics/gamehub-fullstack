import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // NUEVO: para leer parámetros
import { API_URL } from '../config';
import GameCard from '../components/GameCard';

function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams(); // NUEVO
  
  // Obtener parámetros de la URL
  const categoria = searchParams.get('categoria');
  const oferta = searchParams.get('oferta');
  const plataforma = searchParams.get('plataforma');

  useEffect(() => {
    // Construir URL con filtros
    let url = `${API_URL}/api/games`;
    const params = new URLSearchParams();
    
    if (categoria) params.append('categoria', categoria);
    if (oferta) params.append('oferta', oferta);
    if (plataforma) params.append('plataforma', plataforma);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al cargar juegos:", error);
        setLoading(false);
      });
  }, [categoria, oferta, plataforma]); // Se ejecuta cuando cambian los parámetros

  // Título dinámico basado en filtros
  const getPageTitle = () => {
    if (categoria === 'juegos') return '🎮 Videojuegos';
    if (categoria === 'consolas') return '🕹️ Consolas Gaming';
    if (categoria === 'accesorios') return '🎧 Accesorios Gaming';
    if (categoria === 'retro') return '🕰️ Juegos Retro';
    if (oferta === 'true') return '🔥 Ofertas Especiales';
    return 'Nuestros Productos';
  };

  const getPageDescription = () => {
    if (categoria === 'juegos') return 'Los mejores juegos para todas las plataformas';
    if (categoria === 'consolas') return 'Las consolas de última generación';
    if (categoria === 'accesorios') return 'Completa tu setup gaming';
    if (categoria === 'retro') return 'Revive los clásicos';
    if (oferta === 'true') return 'Los mejores descuentos';
    return 'Descubre el catálogo completo de GameHub';
  };

  return (
    <main>
      <section className="productos-hero">
        <h1>{getPageTitle()}</h1>
        <p>{getPageDescription()}</p>
      </section>

      {/* Filtros opcionales - solo si no hay categoría específica */}
      {!categoria && !oferta && (
        <div className="filtros-categorias">
          <button className="filtro-btn" onClick={() => window.location.href = '/catalogo?categoria=juegos'}>
            🎮 Juegos
          </button>
          <button className="filtro-btn" onClick={() => window.location.href = '/catalogo?categoria=consolas'}>
            🕹️ Consolas
          </button>
          <button className="filtro-btn" onClick={() => window.location.href = '/catalogo?categoria=accesorios'}>
            🎧 Accesorios
          </button>
          <button className="filtro-btn" onClick={() => window.location.href = '/catalogo?categoria=retro'}>
            🕰️ Retro
          </button>
          <button className="filtro-btn" onClick={() => window.location.href = '/catalogo?oferta=true'}>
            🔥 Ofertas
          </button>
        </div>
      )}

      {loading ? (
        <p style={{textAlign: 'center', color: '#dcdde1', padding: '40px'}}>Cargando productos...</p>
      ) : (
        <div className="productos-grid">
          {games.map(game => (
            <GameCard key={game._id} producto={game} />
          ))}
        </div>
      )}
    </main>
  );
}

export default GamesPage;