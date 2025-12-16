import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/stylelogin.css'; 
import { API_URL } from '../config';

function LoginPage() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRut, setRegRut] = useState('');
  const [regDireccion, setRegDireccion] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      alert('¡Login exitoso!');

      localStorage.setItem('token', data.token); 
      localStorage.setItem('isAdmin', data.user.isAdmin);
      
      if (data.user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/home');
      }

    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (regPassword !== regConfirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: regNombre,
          email: regEmail,
          password: regPassword,
          rut: regRut,
          direccion: regDireccion
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      alert(data.message);

      setRegNombre('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegRut('');
      setRegDireccion('');

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <header>
        <div className="logo"></div>
        <form className="loginNav" onSubmit={handleLogin}>
          <div className="correo">
            <p>Correo</p>
            <input 
              type="email" 
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required 
            />
          </div>
          <div className="contrasena">
            <p>Contraseña</p>
            <input 
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className="BtnIngresar">Ingresar</button>
          </div>
        </form>
      </header>

      <main>
        <section className="hero">
          <div className="banner">
            <h3>Tu destino gaming definitivo. Los mejores juegos, precios y comunidad.</h3>
          </div>

          <div className="register-container">
            <form id="registerForm" autoComplete="off" onSubmit={handleRegister}>
              <h2>Registro en GameHub</h2>
              <div className="form-group">
                <label htmlFor="nombre">Nombre y Apellido</label>
                <input type="text" id="nombre" name="nombre" value={regNombre} onChange={(e) => setRegNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength="6" />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirme Contraseña</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} required minLength="6" />
              </div>
              <div className="form-group">
                <label htmlFor="rut">RUT</label>
                <input type="text" id="rut" name="rut" value={regRut} onChange={(e) => setRegRut(e.target.value)} required placeholder="Ej: 12345678-9" />
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input type="text" id="direccion" name="direccion" value={regDireccion} onChange={(e) => setRegDireccion(e.target.value)} required minLength="10" /> {/* CORRECCIÓN AQUÍ: setRegDireccion */}
              </div>
              <button type="submit">🎮 Registrarse</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 GameHub. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

export default LoginPage;