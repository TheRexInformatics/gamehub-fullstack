import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function AdminLayout() {
  return (
    <main className="admin-main">
      <aside className="sidebar">
        <h2>Panel Admin</h2>
        <ul>
          {/* AGREGAR TODAS ESTAS OPCIONES: */}
          <li><Link to="/admin">📊 Dashboard</Link></li>
          <li><Link to="/admin/games">🎮 Gestión de Juegos</Link></li>
          <li><Link to="/admin/usuarios">👥 Gestión de Usuarios</Link></li>
          <li><Link to="/admin/ordenes">📦 Gestión de Órdenes</Link></li>
          <li><Link to="/admin/estadisticas">📈 Estadísticas</Link></li>
          <li><Link to="/admin/blog">📝 Gestión de Blog</Link></li>
          <li><Link to="/admin/contactos">📞 Mensajes de Contacto</Link></li>
        </ul>
      </aside>

      <section className="admin-content">
        <Outlet />
      </section>
    </main>
  );
}

export default AdminLayout;