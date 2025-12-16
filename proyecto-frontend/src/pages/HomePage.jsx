import React from 'react';

function HomePage() {
  return (
    <main>
      <section className="hero">
        <h1>Bienvenido a GameHub</h1>
        <p>Tu destino definitivo para videojuegos, consolas y accesorios gaming. <br /> Descubre las mejores ofertas y los lanzamientos más esperados.</p>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🎮 Videojuegos Nuevos</h3>
          <p>Los últimos lanzamientos y clásicos atemporales para todas las plataformas. Pre-orders disponibles.</p>
        </div>
        <div className="feature-card">
          <h3>🕹️ Consolas y Hardware</h3>
          <p>PS5, Xbox Series X, Nintendo Switch y PC Gaming. Todo el hardware que necesitas para jugar.</p>
        </div>
        <div className="feature-card">
          <h3>🎧 Accesorios Gaming</h3>
          <p>Auriculares, teclados, mouse y sillas gaming de las mejores marcas para tu setup perfecto.</p>
        </div>
      </section>
    </main>
  );
}

export default HomePage;