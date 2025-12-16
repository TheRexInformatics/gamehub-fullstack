import React from 'react';

// Este es el componente Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* El símbolo de copyright funciona igual en JSX */}
        <p>&copy; 2025 GameHub. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="#">Términos de Servicio</a>
          <a href="#">Política de Privacidad</a>
          <a href="#">Soporte</a>
          <a href="#">Newsletter</a>
          <a href="#">Contacto</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;