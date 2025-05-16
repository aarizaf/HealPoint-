import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MedicalAppointment from "./pages/MedicalAppointment";

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
    setCurrentRoute(route);
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  // Render the appropriate component based on the current route
  const renderRoute = () => {
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
      case "servicios/urgencias":
        return (
          <MedicalAppointment
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
