import React, { useState, useEffect, useRef } from "react";
import medicoImage from "../imgs/medicos.jpg";
import "./HomePage.css";

const HomePage = ({ navigate, isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("home");
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Efecto para cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // SVG Icons as components
  const CalendarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  const ClockIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const UsersIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const MenuIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );

  const CloseIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  // Menú actualizado con opciones relevantes para una plataforma de gestión de citas
  const navOptions = [
    { name: "Inicio", path: "home" },
    {
      name: "Servicios",
      path: "servicios",
      dropdown: true,
      items: [
        { name: "Asignar cita medica", path: "servicios/urgencias" },
        { name: "Especialidades", path: "servicios/especialidades" },
        { name: "Exámenes", path: "servicios/examenes" },
        { name: "Tratamientos", path: "servicios/tratamientos" },
      ],
    },
    {
      name: "Doctores",
      path: "doctores",
      dropdown: true,
      items: [
        { name: "Directorio Médico", path: "doctores/directorio" },
        { name: "Especialistas", path: "doctores/especialistas" },
        { name: "Horarios", path: "doctores/horarios" },
        { name: "Calificaciones", path: "doctores/calificaciones" },
      ],
    },

    {
      name: "Pacientes",
      path: "pacientes",
      dropdown: true,
      items: [
        { name: "Portal del Paciente", path: "pacientes/portal" },
        { name: "Historial Médico", path: "pacientes/historial" },
        { name: "Próximas Citas", path: "pacientes/citas" },
        { name: "Medicamentos", path: "pacientes/medicamentos" },
      ],
    },
    { name: "Contacto", path: "contacto" },
  ];

  // Estado para los dropdowns
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Features data array for better scalability
  const features = [
    {
      icon: <CalendarIcon />,
      title: "Programación Inteligente",
      description:
        "Sistema de calendario inteligente que optimiza tu disponibilidad y evita reservas duplicadas.",
    },
    {
      icon: <ClockIcon />,
      title: "Gestión del Tiempo",
      description:
        "Reduce las ausencias con recordatorios automáticos y notificaciones de seguimiento.",
    },
    {
      icon: <UsersIcon />,
      title: "Gestión de Pacientes",
      description:
        "Almacena y accede a la información de los pacientes de forma segura en un lugar centralizado.",
    },
  ];

  const handleSignIn = () => {
    navigate("login");
  };

  const handleSignUp = () => {
    navigate("registro");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbarContent">
          <div
            className="logo"
            onClick={() => navigate("home")}
            style={{ cursor: "pointer" }}
          >
            <div className="logoBox">H</div>
            <span className="logoText">HealPoint</span>
          </div>
          {/* Desktop Navigation */}
          <div
            className={windowWidth > 768 ? "navLinks" : "navLinks d-none"}
            ref={dropdownRef}
          >
            {navOptions.map((option, index) => (
              <div key={index} className="navItem">
                <button
                  className={
                    option.dropdown ? "navLink dropdownToggle" : "navLink"
                  }
                  onClick={() => {
                    if (option.dropdown) {
                      setOpenDropdown(openDropdown === index ? null : index);
                    } else {
                      handleNavigate(option.path);
                    }
                  }}
                >
                  {option.name}
                  {option.dropdown && (
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
                      className={`dropdown-arrow ${
                        openDropdown === index ? "rotated" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </button>

                {option.dropdown && openDropdown === index && (
                  <div className="dropdownMenu">
                    {option.items.map((item, i) => (
                      <button
                        key={i}
                        className="dropdownItem"
                        onClick={() => {
                          handleNavigate(item.path);
                          setOpenDropdown(null);
                        }}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!isLoggedIn && (
            <div
              className={
                windowWidth > 768 ? "authButtons" : "authButtons d-none"
              }
            >
              <button className="signInButton" onClick={handleSignIn}>
                Iniciar Sesión
              </button>
              <button
                className="signUpButton"
                onClick={handleSignUp}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0ea271")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#10b981")
                }
              >
                Registrarse
              </button>
            </div>
          )}
          {isLoggedIn && (
            <div className="authButtons">
              <button className="signInButton" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
          ;{/* Mobile Menu Button */}
          <button
            className={
              windowWidth <= 768
                ? "mobileMenuButton"
                : "mobileMenuButton d-none"
            }
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Alternar menú"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && windowWidth <= 768 && (
          <div className="mobileNavLinks">
            {navOptions.map((option, index) => (
              <div key={index} className="mobileNavItem">
                <button
                  className="navLink mobileNavLink"
                  onClick={() => {
                    if (option.dropdown) {
                      setOpenDropdown(openDropdown === index ? null : index);
                    } else {
                      handleNavigate(option.path);
                      setMenuOpen(false);
                    }
                  }}
                >
                  {option.name}
                  {option.dropdown && (
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
                      className={`dropdown-arrow mobile ${
                        openDropdown === index ? "rotated" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </button>

                {option.dropdown && openDropdown === index && (
                  <div className="mobileDropdownMenu">
                    {option.items.map((item, i) => (
                      <button
                        key={i}
                        className="mobileDropdownItem"
                        onClick={() => {
                          handleNavigate(item.path);
                          setOpenDropdown(null);
                          setMenuOpen(false);
                        }}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {!isLoggedIn && (
              <>
                <button
                  className="signInButton mobileNavLink"
                  onClick={handleSignIn}
                >
                  Iniciar Sesión
                </button>
                <button
                  className="signUpButton mobileSignUpButton"
                  onClick={handleSignUp}
                >
                  Registrarse
                </button>
              </>
            )}
            {isLoggedIn && (
              <button
                className="logoutButton mobileNavLink"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Cerrar Sesión
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section - Eliminados los botones "Comenzar" y "Ver Demo" */}
      <div className="hero">
        <h1 className="heroTitle">Gestión de Citas, Simplificada</h1>
        <p className="heroSubtitle">
          HealPoint optimiza su flujo de trabajo de citas con una plataforma
          moderna e intuitiva diseñada para profesionales de la salud y
          proveedores de servicios.
        </p>

        <img
          src={medicoImage}
          alt="Vista previa del panel de HealPoint"
          className="dashboardPreview"
          onMouseOver={(e) => {
            if (windowWidth > 768) {
              e.currentTarget.style.transform = "scale(1.02)";
            }
          }}
          onMouseOut={(e) => {
            if (windowWidth > 768) {
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        />
      </div>

      {/* Features Section */}
      <div className="featuresSection">
        <div className="featuresContent">
          <h2 className="sectionTitle">¿Por qué elegir HealPoint?</h2>
          <p className="sectionDescription">
            Diseñada pensando en los profesionales de la salud, nuestra
            plataforma ofrece todo lo que necesitas para optimizar tu flujo de
            trabajo de citas.
          </p>

          <div className="featuresGrid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="featureCard"
                onMouseOver={(e) => {
                  if (windowWidth > 768) {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 15px rgba(0,0,0,0.1)";
                  }
                }}
                onMouseOut={(e) => {
                  if (windowWidth > 768) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.05)";
                  }
                }}
              >
                <div className="featureIcon">{feature.icon}</div>
                <h3 className="featureTitle">{feature.title}</h3>
                <p className="featureDescription">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div
          className={
            windowWidth > 640 ? "footerContent" : "footerContent column-mobile"
          }
        >
          <div className="footerLogo">
            <div className="footerLogoBox">H</div>
            <span className="footerLogoText">HealPoint</span>
          </div>
          <p className="copyright">
            © 2025 HealPoint. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
