import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_URL } from '../config';

function BlogDetailPage() {
  let { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs/${id}`);
        if (!res.ok) throw new Error('Artículo no encontrado');
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <main>
        <section className="blog-detalle-hero">
          <h1>Cargando artículo...</h1>
        </section>
        <div className="blog-detalle-container">
          <div className="articulo-completo">
            <p style={{color: '#dcdde1', textAlign: 'center', padding: '40px'}}>Cargando contenido...</p>
          </div>
        </div>
      </main>
    );
  }
  
  if (error || !blog) {
    return (
      <main>
        <section className="blog-detalle-hero">
          <h1>Artículo no encontrado</h1>
          <p>El artículo que buscas no existe o fue eliminado.</p>
        </section>
        <div className="blog-detalle-container">
          <div className="articulo-completo">
            <p style={{color: '#e84118', textAlign: 'center', padding: '40px'}}>Error: {error || 'Artículo no disponible'}</p>
            <div style={{textAlign: 'center', marginTop: '20px'}}>
              <Link to="/blogs" className="btn-volver">← Volver al Blog</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="blog-detalle-hero">
        <h1>{blog.titulo}</h1>
        <p>Artículo de GameHub</p>
      </section>

      <div className="blog-detalle-container">
        <div className="articulo-completo">
          <div className="meta-articulo">
            <span>Por: {blog.autor}</span>
            <span>Fecha: {blog.fecha}</span>
          </div>
          
          <div className="imagen-destacada">
            [Imagen para {blog.titulo}]
          </div>
          
          <div className="contenido-articulo">
            <p>{blog.contenido}</p>
          </div>
        </div>

        <div style={{textAlign: 'center', marginTop: '30px'}}>
          <Link to="/blogs" className="btn-volver">← Volver al Blog</Link>
        </div>
      </div>
    </main>
  );
}

export default BlogDetailPage;