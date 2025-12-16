import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function AdminLayout() {
  return (
    // Usamos un <main> con la clase de tu admin.css
    <main className="admin-main">

      {/* 1. La Barra Lateral (Sidebar) */}
      <aside className="sidebar">
        <h2>Panel Admin</h2>
        <ul>
          {/* Links a las futuras páginas de admin */}
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/productos">Gestión de Productos</Link></li>
          <li><Link to="/admin/usuarios">Gestión de Usuarios</Link></li>
        </ul>
      </aside>

      {/* 2. El Contenido (Outlet) */}
      {/* Aquí se cargarán AdminDashboardPage, AdminProductsPage, etc. */}
      <section className="admin-content">
        <Outlet />
      </section>

    </main>
  );
}

export default AdminLayout;