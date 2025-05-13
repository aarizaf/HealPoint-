import React, { useEffect, useState } from 'react';
import './AuthPages.css';

const AuthCallbackPage = ({ navigate }) => {
  const [status, setStatus] = useState('Procesando autenticación...');

  useEffect(() => {
    // Obtener el token de la URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (!token) {
      setStatus('Error de autenticación. No se recibió un token válido.');
      return;
    }
    
    // Guardar el token en localStorage
    localStorage.setItem('healpoint_token', token);
    
    // Comprobar los datos del usuario
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:8000/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        
        const data = await response.json();
        
        if (data.valid && data.user_data) {
          // Guardar datos del usuario
          localStorage.setItem('user_data', JSON.stringify(data.user_data));
          
          // Redirigir al dashboard
          navigate('dashboard');
        } else {
          setStatus('No se pudo verificar el token. Por favor, inténtelo de nuevo.');
          localStorage.removeItem('healpoint_token');
        }
      } catch (error) {
        console.error('Error verificando token:', error);
        setStatus('Error de conexión. Por favor, inténtelo de nuevo más tarde.');
        localStorage.removeItem('healpoint_token');
      }
    };
    
    verifyToken();
  }, [navigate]);

  return (
    <div className="authContainer">
      <div className="authCard" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="logoContainer">
          <div className="logoBox">H</div>
          <span className="logoText">HealPoint</span>
        </div>
        <h2 className="authTitle">{status}</h2>
        
        {status.includes('Error') && (
          <button
            className="authButton"
            style={{ marginTop: '20px' }}
            onClick={() => navigate('login')}
          >
            Volver al inicio de sesión
          </button>
        )}
        
        <div className="loadingSpinner">
          <svg className="spinner" viewBox="0 0 24 24">
            <circle className="spinnerPath" cx="12" cy="12" r="10" fill="none" strokeWidth="3"></circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;