import React from 'react';

function NosotrosPage() {
  return (
    <main>
      <section className="about-hero">
        <h1>🎮 Sobre GameHub</h1>
        <p>Tu destino gaming definitivo desde 2025</p>
      </section>

      <div className="about-content">
        <section className="about-section">
          <h2>Nuestra Historia</h2>
          <p>GameHub nació en 2025 de la pasión por los videojuegos y la comunidad gamer. Todo comenzó cuando nuestro fundador, Martín Villarroel, buscaba un lugar donde encontrar todos los juegos, consolas y accesorios en un solo sitio, con precios justos y asesoramiento real de gamers. Lo que empezó como un proyecto entre amigos se convirtió en la tienda gaming más completa, donde cada producto es probado y recomendado por verdaderos jugadores.</p>
        </section>

        <section className="about-section">
          <h2>Nuestro Equipo</h2>
          <p>Somos gamers apasionados que amamos lo que hacemos.</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">🎮</div>
              <h3>Martín Villarroel</h3>
              <p>Fundador y CEO</p>
            </div>
            <div className="team-member">
              <div className="member-photo">🕹️</div>
              <h3>Ian Badilla</h3>
              <p>Especialista en Hardware</p>
            </div>
            <div className="team-member">
              <div className="member-photo">🎧</div>
              <h3>Matías Espinoza</h3>
              <p>Community Manager</p>
            </div>
            <div className="team-member">
              <div className="member-photo">🔥</div>
              <h3>Vicente Placencia</h3>
              <p>Especialista en Juegos</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Nuestra Misión</h2>
          <div className="values-list">
            <div className="value-item">
              <div className="value-icon">🎯</div>
              <h3>Calidad Garantizada</h3>
              <p>Productos 100% originales con garantía oficial</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🚚</div>
              <h3>Envío Rápido</h3>
              <p>Entrega en 24-48 horas en todo Chile</p>
            </div>
            <div className="value-item">
              <div className="value-icon">💬</div>
              <h3>Soporte Gamer</h3>
              <p>Asesoramiento de expertos gamers reales</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default NosotrosPage;