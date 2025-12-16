import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function AdminNewGamePage() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [genero, setGenero] = useState('');
  const [desarrollador, setDesarrollador] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const gameData = {
      titulo,
      precio: Number(precio),
      imagen,
      plataforma,
      genero,
      desarrollador,
      descripcion,
      stock: Number(stock)
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(gameData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear el juego');
      }

      alert('¡Juego creado con éxito!');
      navigate('/admin/games');

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>🎮 Crear Nuevo Juego</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label htmlFor="gameTitle">Título del Juego:</label>
        <input type="text" id="gameTitle" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

        <label htmlFor="gamePrice">Precio (CLP):</label>
        <input type="number" id="gamePrice" value={precio} onChange={(e) => setPrecio(e.target.value)} min="0" required />

        <label htmlFor="gameImage">URL de la Imagen:</label>
        <input type="text" id="gameImage" value={imagen} onChange={(e) => setImagen(e.target.value)} required />
        <small style={{color:'#8c9db5', fontSize:'12px'}}>Ej: https://ejemplo.com/imagen.jpg</small>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px'}}>
          <div>
            <label htmlFor="gamePlatform">Plataforma:</label>
            <select id="gamePlatform" value={plataforma} onChange={(e) => setPlataforma(e.target.value)} required>
              <option value="">Seleccione plataforma</option>
              <option value="PC">PC</option>
              <option value="PlayStation 5">PlayStation 5</option>
              <option value="PlayStation 4">PlayStation 4</option>
              <option value="Xbox Series X/S">Xbox Series X/S</option>
              <option value="Xbox One">Xbox One</option>
              <option value="Nintendo Switch">Nintendo Switch</option>
              <option value="Nintendo 3DS">Nintendo 3DS</option>
              <option value="Mobile">Mobile</option>
              <option value="Multiplataforma">Multiplataforma</option>
            </select>
          </div>

          <div>
            <label htmlFor="gameGenre">Género:</label>
            <select id="gameGenre" value={genero} onChange={(e) => setGenero(e.target.value)} required>
              <option value="">Seleccione género</option>
              <option value="Acción">Acción</option>
              <option value="Aventura">Aventura</option>
              <option value="RPG">RPG</option>
              <option value="Shooter">Shooter</option>
              <option value="Estrategia">Estrategia</option>
              <option value="Deportes">Deportes</option>
              <option value="Carreras">Carreras</option>
              <option value="Indie">Indie</option>
              <option value="Simulación">Simulación</option>
              <option value="Terror">Terror</option>
            </select>
          </div>
        </div>

        <label htmlFor="gameDeveloper">Desarrollador:</label>
        <input type="text" id="gameDeveloper" value={desarrollador} onChange={(e) => setDesarrollador(e.target.value)} />

        <label htmlFor="gameStock">Stock disponible:</label>
        <input type="number" id="gameStock" value={stock} onChange={(e) => setStock(e.target.value)} min="0" required />

        <label htmlFor="gameDescription">Descripción:</label>
        <textarea id="gameDescription" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="4" />

        <button type="submit" className="admin-btn">🎮 Crear Juego</button>
      </form>
    </div>
  );
}

export default AdminNewGamePage;