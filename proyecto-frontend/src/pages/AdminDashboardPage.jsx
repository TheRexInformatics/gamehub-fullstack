import React from 'react';

function AdminDashboardPage() {
  return (
    <div>
      <h1>🎮 Panel de Administración GameHub</h1>
      <p>Gestiona tu catálogo de juegos, consolas y accesorios gaming.</p>
      
      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ background: 'linear-gradient(135deg, #00a8ff 0%, #0097e6 100%)', padding: '20px', borderRadius: '10px', color: 'white' }}>
          <h3>📊 Estadísticas</h3>
          <p>Vista general de ventas y usuarios</p>
        </div>
        
        <div style={{ background: 'linear-gradient(135deg, #4cd137 0%, #44bd32 100%)', padding: '20px', borderRadius: '10px', color: 'white' }}>
          <h3>🎮 Juegos</h3>
          <p>Gestiona tu catálogo de videojuegos</p>
        </div>
        
        <div style={{ background: 'linear-gradient(135deg, #9c88ff 0%, #8c7ae6 100%)', padding: '20px', borderRadius: '10px', color: 'white' }}>
          <h3>👥 Usuarios</h3>
          <p>Administra usuarios y permisos</p>
        </div>
        
        <div style={{ background: 'linear-gradient(135deg, #fbc531 0%, #e1b12c 100%)', padding: '20px', borderRadius: '10px', color: 'white' }}>
          <h3>📦 Órdenes</h3>
          <p>Revisa y gestiona pedidos</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;