import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token_ws');
    const tbkToken = searchParams.get('TBK_TOKEN');
    
    console.log('🔍 Parámetros de pago:', { token, tbkToken });
    
    if (tbkToken) {
      setError('El pago fue cancelado por el usuario');
      setLoading(false);
      return;
    }
    
    if (token) {
      confirmPayment(token);
    } else {
      setError('No se recibió token de transacción');
      setLoading(false);
    }
  }, [searchParams]);

  const confirmPayment = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/payments/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Error al confirmar pago');
      }
      
      setResult(data);
      
    } catch (err) {
      setError(err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <main className="cart-outer">
        <div className="cart-super-container">
          <h1>🔄 Procesando Pago...</h1>
          <p>Por favor, espera mientras confirmamos tu transacción.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-outer">
      <div className="cart-super-container">
        <h1>{result?.success ? '✅ Pago Exitoso' : '❌ Pago Fallido'}</h1>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {result && (
          <div className={`payment-result ${result.success ? 'success' : 'failure'}`}>
            <div className="summary-details">
              <div className="summary-row">
                <span>Orden de Compra:</span>
                <span>{result.buy_order || 'N/A'}</span>
              </div>
              
              <div className="summary-row">
                <span>Monto:</span>
                <span>{formatPrice(result.amount)}</span>
              </div>
              
              <div className="summary-row">
                <span>Código de Autorización:</span>
                <span>{result.authorization_code || 'N/A'}</span>
              </div>
              
              <div className="summary-row">
                <span>Fecha:</span>
                <span>{result.transaction_date ? 
                  new Date(result.transaction_date).toLocaleString('es-CL') : 'N/A'}</span>
              </div>
              
              <div className="summary-row">
                <span>Estado:</span>
                <span className={`status-badge ${result.success ? 'badge-active' : 'badge-inactive'}`}>
                  {result.success ? 'APROBADO' : 'RECHAZADO'}
                </span>
              </div>
              
              {result.response_description && (
                <div className="summary-row">
                  <span>Descripción:</span>
                  <span>{result.response_description}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => navigate('/home')}
            className="btn-ver-detalle"
          >
            Volver al Inicio
          </button>
          
          <button 
            onClick={() => navigate('/catalogo')}
            className="btn-ver-detalle"
            style={{ marginLeft: '10px', background: 'rgba(0,255,136,0.1)', color: '#00ff88' }}
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    </main>
  );
}

export default PaymentResultPage;