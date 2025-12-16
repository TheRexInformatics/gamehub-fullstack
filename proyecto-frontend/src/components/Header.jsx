import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { cartCount, fetchCartCount, clearCartCount } = useCart();

  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    if (location.pathname !== '/' && location.pathname !== '/login') {
      fetchCartCount();
    }
  }, [location, fetchCartCount]);

  // Mostrar carrito en todas las páginas excepto login y home
  const showCarrito = location.pathname !== '/' && 
                     location.pathname !== '/login' && 
                     location.pathname !== '/home';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    clearCartCount();
    setIsMenuOpen(false);
    navigate('/'); 
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header>
      <Link to="/home" className="logo"></Link>
      
      <nav>
        <ul>
          <li><Link to="/home">Inicio</Link></li>
          
          {/* CATEGORÍAS SIMPLIFICADAS - TODAS APUNTAN A /catalogo CON PARÁMETROS */}
          <li><Link to="/catalogo?categoria=juegos">🎮 Juegos</Link></li>
          <li><Link to="/catalogo?categoria=consolas">🕹️ Consolas</Link></li>
          <li><Link to="/catalogo?categoria=accesorios">🎧 Accesorios</Link></li>
          <li><Link to="/catalogo?categoria=retro">🕰️ Retro</Link></li>
          <li><Link to="/catalogo?oferta=true">🔥 Ofertas</Link></li>
          
          <li><Link to="/blogs">📰 Blog Gaming</Link></li>
          <li><Link to="/contacto">📞 Contacto</Link></li>

          {/* CARRITO - Visible en todas las páginas excepto login/home */}
          {showCarrito && (
            <li>
              <Link to="/carrito" className="cart-link">
                🛒 Carrito 
                {cartCount > 0 && (
                  <span id="cart-count" className="cart-badge">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          )}

          {/* ADMIN LINK */}
          {isAdmin && (
            <li>
              <Link to="/admin" className="admin-link">
                ⚙️ Admin
              </Link>
            </li>
          )}

          {/* MENÚ DE USUARIO O LOGIN */}
          {token ? (
            <li className="user-menu-container">
              <button 
                className="user-icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                aria-label="Menú de usuario"
              >
                👤
              </button>
              
              {isMenuOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <strong>Mi Cuenta</strong>
                  </div>
                  <Link 
                    to="/perfil" 
                    onClick={() => setIsMenuOpen(false)}
                    className="dropdown-item"
                  >
                    👤 Ver Perfil
                  </Link>
                  <Link 
                    to="/pedidos" 
                    onClick={() => setIsMenuOpen(false)}
                    className="dropdown-item"
                  >
                    📦 Mis Pedidos
                  </Link>
                  <Link 
                    to="/wishlist" 
                    onClick={() => setIsMenuOpen(false)}
                    className="dropdown-item"
                  >
                    ❤️ Mi Wishlist
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li>
              <Link to="/login" className="login-link">🎮 Iniciar Sesión</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;