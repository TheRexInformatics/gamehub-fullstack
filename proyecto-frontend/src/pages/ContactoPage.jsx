import React, { useState } from 'react';
import { API_URL } from '../config';

function ContactoPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [asunto, setAsunto] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nombre, 
          email, 
          asunto,
          mensaje 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al enviar mensaje');
      }
      
      alert('¡Mensaje enviado con éxito!');
      
      setNombre('');
      setEmail('');
      setAsunto('');
      setMensaje('');

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <main className="contact-main">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h2>Contáctanos - GameHub</h2>
          <p>¿Consultas sobre juegos, pedidos o soporte técnico? Estamos aquí para ayudarte.</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Nombre:</label>
            <input 
              type="text" 
              id="name" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required 
              placeholder="Tu nombre"
            />

            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="tu@email.com"
            />

            <label htmlFor="subject">Asunto:</label>
            <select 
              id="subject" 
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              required
            >
              <option value="">Selecciona un asunto</option>
              <option value="consulta">Consulta sobre juegos</option>
              <option value="pedido">Estado de pedido</option>
              <option value="soporte">Soporte técnico</option>
              <option value="otro">Otro</option>
            </select>

            <label htmlFor="message">Mensaje:</label>
            <textarea 
              id="message" 
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
              placeholder="Describe tu consulta aquí..."
            ></textarea>

            <button type="submit" className="btn-comprar">Enviar Mensaje</button>
          </form>
        </div>
      </section>   
    </main>
  );
}

export default ContactoPage;