import React, { useState } from 'react';
import medicoImage from '../imgs/medicos.jpg';
import './AuthPages.css';

const RegisterPage = ({ navigate }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      console.log('Intentando registrar con:', formData);
      await new Promise(r => setTimeout(r, 1000));
      // navigate('registro-exitoso');
    } catch {
      setError('No se pudo completar el registro. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnHome = () => {
    navigate('home');
  };

  return (
    <div className="authContainer">
      <div className="authBanner">
        <img src={medicoImage} alt="Médicos" />
      </div>

      <div className="authCard registerCard">
        <div className="returnHomeLink" onClick={handleReturnHome}>
          <span>Volver al inicio</span>
        </div>

        <div className="authHeader">
          <div className="logoContainer">
            <div className="logoBox">H</div>
            <span className="logoText">HealPoint</span>
          </div>
          <h1 className="authTitle">Crea tu cuenta</h1>
          <p className="authSubtitle">
            Únete a HealPoint y comienza a gestionar tus citas y pacientes de forma eficiente
          </p>
        </div>

        {error && (
          <div className="errorAlert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="authForm">
          <div className="formGroup">
            <label htmlFor="nombre" className="formLabel">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="formInput"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="email" className="formLabel">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="formInput"
              placeholder="tu@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password" className="formLabel">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="formInput"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              autoComplete="new-password"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="confirmPassword" className="formLabel">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="formInput"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="formGroup termsCheck">
            <input
              type="checkbox"
              id="aceptaTerminos"
              name="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onChange={handleChange}
              required
            />
            <label htmlFor="aceptaTerminos">
              Acepto los <span className="termsLink" onClick={() => navigate('terminos')}>Términos de servicio</span> y la <span className="termsLink" onClick={() => navigate('privacidad')}>Política de privacidad</span>
            </label>
          </div>

          <button
            type="submit"
            className="authButton"
            disabled={loading || !formData.aceptaTerminos}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="authPrompt">
          <span>¿Ya tienes una cuenta?</span>
          <span className="authLink" onClick={() => navigate('login')}>
            Iniciar sesión
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
