import React, { useState } from 'react';
import medicoImage from '../imgs/medicos.jpg';
import './AuthPages.css';

const LoginPage = ({ navigate, setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      console.log('Intentando iniciar sesión con:', formData);
      await new Promise(r => setTimeout(r, 1000));
      // navigate('dashboard');
    } catch {
      setError('Credenciales incorrectas. Verifica email y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setError('');
    try {
      console.log('Iniciando sesión con Google...');
      await new Promise(r => setTimeout(r, 1000));
      // Aquí iría la lógica de autenticación con Google
      // navigate('dashboard');
    } catch (err) {
      console.error('Error al iniciar sesión con Google:', err);
      setError('No se pudo iniciar sesión con Google. Por favor intenta más tarde.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleReturnHome = () => {
    navigate("home");
  };

  // El resto de tu componente (JSX) permanece igual...
  return (
    <div className="authContainer">
      {/* Banner con imagen y overlay */}
      <div className="authBanner">
        <img src={medicoImage} alt="Médicos" />
        <div className="bannerOverlay"></div>
      </div>

      {/* Card de autenticación */}
      <div className="authCard">
        <div className="returnHomeLink" onClick={handleReturnHome}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          <span>Volver al inicio</span>
        </div>

        <div className="authHeader">
          <div className="logoContainer">
            <div className="logoBox">H</div>
            <span className="logoText">HealPoint</span>
          </div>
          <h1 className="authTitle">Bienvenido de nuevo</h1>
          <p className="authSubtitle">
            Inicia sesión para continuar gestionando tu agenda y pacientes de
            forma eficiente
          </p>
        </div>

        {error && (
          <div className="errorAlert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Botón de Google */}
        <button
          type="button"
          className="googleButton"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <div className="buttonLoading">
              <svg className="spinner" viewBox="0 0 24 24">
                <circle
                  className="spinnerPath"
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  strokeWidth="3"
                ></circle>
              </svg>
              <span>Conectando...</span>
            </div>
          ) : (
            <>
              <svg
                width="18"
                height="18"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              <span>Continuar con Google</span>
            </>
          )}
        </button>

        <div className="orDivider">
          <span>o</span>
        </div>

        <form onSubmit={handleSubmit} className="authForm">
          <div className="formGroup">
            <label htmlFor="email" className="formLabel">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Correo electrónico
            </label>
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
            <div className="passwordHeader">
              <label htmlFor="password" className="formLabel">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Contraseña
              </label>
              <span
                className="forgotPassword"
                onClick={() => navigate("recuperar-password")}
              >
                ¿Olvidaste tu contraseña?
              </span>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              className="formInput"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="formGroup checkboxGroup">
            <div className="rememberMe">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Mantener sesión iniciada</label>
            </div>
          </div>

          <button type="submit" className="authButton" disabled={loading}>
            {loading ? (
              <div className="buttonLoading">
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle
                    className="spinnerPath"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="3"
                  ></circle>
                </svg>
                <span>Iniciando sesión...</span>
              </div>
            ) : (
              <span>Iniciar sesión</span>
            )}
          </button>
        </form>

        <div className="authPrompt">
          <span>¿No tienes una cuenta?</span>
          <span className="authLink" onClick={() => navigate("registro")}>
            Regístrate ahora
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;