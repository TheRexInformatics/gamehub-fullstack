import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const res = await fetch(`${API_URL}/api/auth/me`, {
                    headers: { 'x-auth-token': token }
                });
                
                if (!res.ok) {
                    throw new Error('Token inválido o expirado');
                }
                
                const data = await res.json();
                setUser(data);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar perfil:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('isAdmin');
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <main className="cart-outer">
                <div className="cart-super-container">
                    <h1>Cargando perfil...</h1>
                </div>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="cart-outer">
                <div className="cart-super-container">
                    <h1>Perfil no encontrado</h1>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-outer">
            <div className="cart-super-container">
                <h1>Mi Perfil GameHub</h1>
                
                <div className="about-section">
                    <h2>Información Personal</h2>
                    
                    <div className="productos-grid" style={{gridTemplateColumns: '1fr', gap: '10px'}}>
                        <div className="game-card">
                            <div className="game-info">
                                <div className="game-meta">
                                    <span>Nombre:</span>
                                    <span>{user.nombre}</span>
                                </div>
                                <div className="game-meta">
                                    <span>Email:</span>
                                    <span>{user.email}</span>
                                </div>
                                <div className="game-meta">
                                    <span>RUT:</span>
                                    <span>{user.rut || 'No registrado'}</span>
                                </div>
                                <div className="game-meta">
                                    <span>Dirección:</span>
                                    <span>{user.direccion || 'No registrada'}</span>
                                </div>
                                <div className="game-meta">
                                    <span>Tipo de Cuenta:</span>
                                    <span>{user.isAdmin ? '👑 Administrador' : '👤 Usuario'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                        <button 
                            className="btn-ver-detalle"
                            onClick={() => navigate('/home')}
                        >
                            Volver a Juegos
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;