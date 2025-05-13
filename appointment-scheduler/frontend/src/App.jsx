import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { checkAuthentication } from './utils/auth';

// Componente para rutas protegidas
const ProtectedRoute = ({ component: Component, navigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const data = await checkAuthentication();
      if (data) {
        setIsAuthenticated(true);
        setUserData(data);
      } else {
        navigate('login');
      }
    };
    
    verifyAuth();
  }, [navigate]);
  
  if (isAuthenticated === null) {
    // Estado de carga mientras se verifica
    return (
      <div className="loadingPage">
        <div className="loadingSpinner">
          <svg className="spinner" viewBox="0 0 24 24">
            <circle className="spinnerPath" cx="12" cy="12" r="10" fill="none" strokeWidth="3"></circle>
          </svg>
        </div>
        <p>Cargando...</p>
      </div>
    );
  }
  
  return isAuthenticated ? <Component navigate={navigate} userData={userData} /> : null;
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Función para navegar entre páginas
  const navigate = (page) => {
    setCurrentPage(page);
    // Opcional: desplazarse hacia arriba al cambiar de página
    window.scrollTo(0, 0);
  };

  // Renderizar la página correspondiente según el estado
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'login':
        return <LoginPage navigate={navigate} />;
      case 'registro':
        return <RegisterPage navigate={navigate} />;
      case 'auth-callback':
        return <AuthCallbackPage navigate={navigate} />;
      case 'dashboard':
        // Usar ProtectedRoute para la ruta de dashboard
        return <ProtectedRoute 
          component={(props) => <div>Dashboard Page (por implementar)</div>} 
          navigate={navigate} 
        />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  // Verificar si hay un parámetro auth-callback en la URL para manejar el retorno de Google OAuth
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('auth-callback')) {
      setCurrentPage('auth-callback');
    } else if (path.includes('login')) {
      setCurrentPage('login');
    } else if (path.includes('registro')) {
      setCurrentPage('registro');
    } else if (path.includes('dashboard')) {
      setCurrentPage('dashboard');
    }
  }, []);

  return (
    <div className="app">
      {renderPage()}
    </div>
  );
}

export default App;