import React, { useState, useEffect, useRef } from "react";
import medicoImage from "../imgs/medicos.jpg";
import "./HomePage.css";

const HomePage = ({ navigate, isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userEmail, setUserEmail] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const especialidadesRef = useRef(null);

  const scrollToEspecialidades = () => {
    especialidadesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Get email from localStorage if logged in
    if (isLoggedIn) {
      const email = localStorage.getItem("userEmail") || "Usuario";
      setUserEmail(email);
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoggedIn]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserMenuOpen(false);
    navigate("home");
  };

  // Icon components
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

  // Navigation with options relevant for appointment management platform
  const navOptions = [
    { name: "Inicio", path: "home" },
    {
      name: "Servicios",
      path: "servicios",
      dropdown: true,
      items: [
        { name: "Asignar cita médica", path: "cita-medica" },
        { name: "Especialidades", path: "servicios/especialidades" },
        
        { name: "Tratamientos", path: "servicios/tratamientos" },
        { name: "Medicamentos", path: "servicios/Medicamentos" },
      ],
    },
    {
      name: "Doctores",
      path: "doctores",
      dropdown: true,
      items: [
        { name: "Directorio Médico", path: "doctores/directorio" },
     
     
        
      ],
    },
  
    { name: "Contacto", path: "contacto" },
  ];

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

  // Check if user is logged in before navigating to protected routes
  const handleNavigate = (path) => {
    // Protected paths that require authentication
    const protectedPaths = [
      "cita-medica",
      "mis-citas",
      "servicios/examenes",
      "servicios/tratamientos",
      "servicios/medicamentos",
      "doctores/directorio",
      "doctores/especialistas",
      "doctores/horarios",
      "doctores/calificaciones",
      "pacientes/portal",
      "pacientes/historial",
    ];

    // If protected and user is not logged in, redirect to login
    if (path === "servicios/especialidades") {
      scrollToEspecialidades();  // Scroll to especialidades section
      return;
    }

    if (protectedPaths.includes(path) && !isLoggedIn) {
      navigate("login");
    } else {
      navigate(path);
    }
  };

  // Helper function to get a nice display name from email
  const getUserDisplayName = () => {
    if (!userEmail) return "Usuario";

    // If email contains @, get the part before @
    if (userEmail.includes("@")) {
      const name = userEmail.split("@")[0];
      // Capitalize first letter
      return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return userEmail;
  };

  // Render user profile or login/register buttons
  const renderAuthSection = () => {
    if (isLoggedIn) {
      return (
        <div
          className={windowWidth > 768 ? "userProfile" : "userProfile d-none"}
          ref={userMenuRef}
        >
          <button
            className="userButton"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="userAvatar">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <span className="userName">{getUserDisplayName()}</span>
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
              className={`dropdown-arrow ${userMenuOpen ? "rotated" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {userMenuOpen && (
            <div className="userMenu">
              <div className="userMenuHeader">
                <span className="userMenuEmail">{userEmail}</span>
              </div>
              <div className="userMenuDivider"></div>
              <button
                className="userMenuItem"
                onClick={() => handleNavigate("perfil")}
              >
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Mi Perfil
              </button>
              <button
                className="userMenuItem"
                onClick={() => handleNavigate("mis-citas")}
              >
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Mis Citas
              </button>
              <div className="userMenuDivider"></div>
              <button
                className="userMenuItem logoutMenuItem"
                onClick={handleLogout}
              >
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          className={windowWidth > 768 ? "authButtons" : "authButtons d-none"}
        >
          <button className="signInButton" onClick={() => navigate("login")}>
            Iniciar Sesión
          </button>
          <button
            className="signUpButton"
            onClick={() => navigate("registro")}
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
      );
    }
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

          {/* Replace with the new auth section */}
          {renderAuthSection()}

          {/* Mobile Menu Button */}
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

            {/* Add user information for logged in users */}
            {isLoggedIn ? (
              <div className="mobileUserSection">
                <div className="mobileUserHeader">
                  <div className="userAvatar">
                    {userEmail.charAt(0).toUpperCase()}
                  </div>
                  <span className="userMenuEmail">{userEmail}</span>
                </div>

                <button
                  className="mobileNavLink mobileMenuItem"
                  onClick={() => {
                    handleNavigate("perfil");
                    setMenuOpen(false);
                  }}
                >
                  Mi Perfil
                </button>

                <button
                  className="mobileNavLink mobileMenuItem"
                  onClick={() => {
                    handleNavigate("mis-citas");
                    setMenuOpen(false);
                  }}
                >
                  Mis Citas
                </button>

                <button
                  className="mobileNavLink logoutButton"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <>
                <button
                  className="signInButton mobileNavLink"
                  onClick={() => navigate("login")}
                >
                  Iniciar Sesión
                </button>
                <button
                  className="signUpButton mobileSignUpButton"
                  onClick={() => navigate("registro")}
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h1 className="heroTitle">Gestión de Citas, Simplificada</h1>
        <p className="heroSubtitle">
          HealPoint optimiza su flujo de trabajo de citas con una plataforma
          moderna e intuitiva diseñada para profesionales de la salud y
          proveedores de servicios.
        </p>

        {/* Añadir botón de acción principal */}
        <div className="heroCta">
          <button
            className="ctaButton"
            onClick={() => handleNavigate("cita-medica")}
          >
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Agendar Cita Médica
          </button>
        </div>

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

      <div ref={especialidadesRef} className="especialidadesSection">
        <h2 className="sectionTitle"> Nuestras Especialidades</h2>
        <p className="sectionDescription">
          Contamos con un equipo de especialistas dedicados a brindarte la mejor
          atención en cada área de la salud.
        </p>
        <div className="especialidadesGrid">
          {[
            {
              nombre: "Cardiología",
              descripcion:
                "Diagnóstico y tratamiento de enfermedades del corazón.",
              imagen: "/imgs/specialties/cardiologia.jpg",
            },
            {
              nombre: "Dermatología",
              descripcion: "Cuidado de la piel, cabello y uñas.",
              imagen: "/imgs/specialties/dermatologia.jpg",
            },
            {
              nombre: "Ginecología",
              descripcion: "Salud integral de la mujer.",
              imagen: "/imgs/specialties/ginecologia.jpg",
            },
            {
              nombre: "Pediatría",
              descripcion: "Cuidado de la salud infantil.",
              imagen: "/imgs/specialties/pediatria.jpg",
            },
            {
              nombre: "Neurología",
              descripcion: "Sistema nervioso y trastornos neurológicos.",
              imagen: "/imgs/specialties/neurologia.jpg",
            },
            {
              nombre: "Odontología",
              descripcion: "Salud bucal y tratamientos dentales.",
              imagen: "/imgs/specialties/odontologia.jpg",
            },
            {
              nombre: "Oftalmología",
              descripcion: "Salud visual y tratamientos de la vista.",
              imagen: "/imgs/specialties/oftalmologia.jpg",
            },
          ].map((esp, idx) => (
            <div key={idx} className="especialidadCard">
              <img
                src={esp.imagen}
                alt={esp.nombre}
                className="especialidadImage"
              />
              <h3 className="especialidadTitle">{esp.nombre}</h3>
              <p className="especialidadDescription">{esp.descripcion}</p>
            </div>
          ))}
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