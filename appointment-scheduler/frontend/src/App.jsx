import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Función para navegar entre páginas
  const navigate = (page) => {
    setCurrentPage(page);
    // Opcional: desplazarse hacia arriba al cambiar de página
    window.scrollTo(0, 0);
  };

  // Renderizar la página correspondiente según el estado
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
      case "login":
        return <LoginPage navigate={navigate} setIsLoggedIn={setIsLoggedIn} />;
      case "registro":
        return <RegisterPage navigate={navigate} />;
      default:
        return (
          <HomePage
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
    }
  };

  return <div className="app">{renderPage()}</div>;
}

export default App;
