import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MedicalAppointment from "./pages/MedicalAppointment";
import ContactPage from "./pages/ContactPage";
import MyCitations from "./pages/Mycitations";
import MiPerfil from "./pages/Miperfil";
import DirectorioMedico from "./pages/DirectorioMedico";
import Medicamentos from "./pages/Medicamentos";
import Tratamientos from "./pages/Tratamientos"; // Importamos el nuevo componente

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("home");

  // Check for existing login when app loads
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Navigation function
  const navigate = (route) => {
    console.log("Navigating to:", route); // Añade este log para depurar
    setCurrentRoute(route);
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  // Render the appropriate component based on the current route
  const renderRoute = () => {
    console.log("Current route:", currentRoute); // Añade este log para depurar
    
    switch (currentRoute) {
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
      case "contacto":
        return (
          <ContactPage
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
      case "cita-medica":
        return (
          <MedicalAppointment
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
      case "mis-citas":
        return (
          <MyCitations
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
      case "perfil":
        return (
          <MiPerfil
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
      case "doctores/directorio":
        return (
          <DirectorioMedico
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
      case "servicios/Medicamentos":
        return (
          <Medicamentos
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
      // Añadimos la nueva ruta para Tratamientos
      case "servicios/tratamientos":
        return (
          <Tratamientos
            navigate={navigate}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
      // Add other routes here
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

  return <div className="App">{renderRoute()}</div>;
}

export default App;