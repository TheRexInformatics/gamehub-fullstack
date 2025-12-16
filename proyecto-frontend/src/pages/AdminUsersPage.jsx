import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar usuarios');
      setUsers(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleAdmin = async (userId, currentStatus) => {
    const action = currentStatus ? 'quitar admin' : 'hacer admin';
    if (!window.confirm(`¿${action} a este usuario?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/toggle-admin`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ isAdmin: !currentStatus })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al actualizar');
      }
      
      alert(`Usuario ${action === 'hacer admin' ? 'ahora es administrador' : 'ya no es administrador'}`);
      fetchUsers();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>👥 Gestión de Usuarios</h1>
      
      <div className="search-filter">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o email..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Registro</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6">Cargando usuarios...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="6">No se encontraron usuarios</td></tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{user.nombre}</strong>
                    {user.rut && <div style={{fontSize:'12px', color:'#8c9db5'}}>RUT: {user.rut}</div>}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.createdAt ? 
                      new Date(user.createdAt).toLocaleDateString('es-CL') : 
                      'N/A'
                    }
                  </td>
                  <td>
                    <span className={`status-badge ${user.isAdmin ? 'badge-active' : 'badge-inactive'}`}>
                      {user.isAdmin ? '👑 Admin' : '👤 Usuario'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`acciones-btn ${user.isAdmin ? 'edit-btn' : 'view-btn'}`}
                      onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                    >
                      {user.isAdmin ? '👑 Quitar Admin' : '⭐ Hacer Admin'}
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

export default AdminUsersPage;