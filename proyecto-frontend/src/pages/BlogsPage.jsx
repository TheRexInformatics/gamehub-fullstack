import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs`);
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error al cargar blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <main className="blogs-main">
      <section className="blogs-hero">
        <h1>Blog Gaming</h1>
        <p>Reseñas, guías, y las últimas noticias del mundo gaming.</p>
      </section>

      <div className="blog-main-container">
        <section className="blog-section">
          <h2 className="section-header">Artículos Destacados</h2>
          <div className="section-content">

            {loading && <p style={{ color: '#dcdde1', textAlign: 'center', padding: '20px' }}>Cargando artículos...</p>}

            {blogs.map(blog => (
              <div className="blog-card" key={blog._id || blog.id}>
                <Link to={`/blogs/${blog._id || blog.id}`}> 
                  <h3>{blog.titulo}</h3>
                  <p className="fecha">{blog.fecha}</p>
                  <p>{blog.contenido ? blog.contenido.substring(0, 100) + '...' : 'Sin contenido disponible'}</p>
                </Link>
              </div>
            ))}

          </div>
        </section>

        <section className="blog-section">
          <h2 className="section-header">Próximos Lanzamientos Gaming</h2>
          <div className="lanzamientos-content">
            <div className="lanzamiento">
              <div className="lanzamiento-imagen">🎮</div>
              <h3>RPG Épico 2025</h3>
              <p>Junio 2025</p>
            </div>
            <div className="lanzamiento">
              <div className="lanzamiento-imagen">🕹️</div>
              <h3>Shooter Competitivo</h3>
              <p>Agosto 2025</p>
            </div>
            <div className="lanzamiento">
              <div className="lanzamiento-imagen">🏎️</div>
              <h3>Carreras Extremas</h3>
              <p>Octubre 2025</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default BlogsPage;