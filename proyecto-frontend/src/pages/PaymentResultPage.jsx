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
    const successToken = searchParams.get('token_ws');
    const failureToken = searchParams.get('TBK_TOKEN');
    
    if (failureToken) {
      setError('El pago fue cancelado por el usuario.');
      setLoading(false);
      return;
    }

    if (successToken) {
      const commitPayment = async (token) => {
        try {
          const res = await fetch(`${API_URL}/api/payments/commit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
          });
          
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error al confirmar pago');
          }
          
          const data = await res.json();
          setResult(data);
        } catch (err) {
          setError(err.message || 'Error al confirmar el pago');
        } finally {
          setLoading(false);
        }
      };
      commitPayment(successToken);
      return;
    }
    
    setError('No se encontró un token de pago válido.');
    setLoading(false);
  }, [searchParams]);

  const getPaymentDetails = () => {
    if (!result) return null;

    const isSuccess = result.responseCode === 0;
    
    return (
      <div className={`payment-result ${isSuccess ? 'success' : 'failure'}`}>
        <h2>{isSuccess ? '🎉 ¡Pago Exitoso!' : '❌ Pago Fallido'}</h2>
        <p><strong>Orden de Compra:</strong> {result.buyOrder}</p>
        <p><strong>Monto:</strong> ${result.amount?.toLocaleString('es-CL')}</p>
        <p><strong>Fecha:</strong> {new Date(result.transactionDate).toLocaleString('es-CL')}</p>
        <p><strong>Estado:</strong> {result.status}</p>
        {!isSuccess && result.responseDescription && (
          <p><strong>Descripción:</strong> {result.responseDescription}</p>
        )}
      </div>
    );
  };

  return (
    <main className="cart-outer">
      <div className="cart-super-container">
        <h1>🎮 Resultado del Pago</h1>
        <div className="cart-main">
          {loading && <p>Confirmando tu pago...</p>}
          {error && <p className="error-message">⚠️ {error}</p>}
          {result && getPaymentDetails()}
          
          <button 
            className="btn-ver-detalle"
            onClick={() => navigate('/home')} 
            style={{marginTop: '20px'}}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </main>
  );
}

export default PaymentResultPage;