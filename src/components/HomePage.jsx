import React, { useState, useEffect, useRef } from "react";
import medicoImage from "../imgs/medicos.jpg";
import home2 from "../imgs/home2.jpg";
import home3 from "../imgs/home3.jpg";
import "./HomePage.css";
import Carousel from "./Carousel";
import { motion } from "framer-motion";

const HomePage = ({ navigate, isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userEmail, setUserEmail] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const especialidadesRef = useRef(null);

  // Nuevo array para las estadísticas
  const stats = [
    { value: "15k+", label: "Pacientes atendidos" },
    { value: "25+", label: "Especialistas" },
    { value: "98%", label: "Satisfacción" },
  ];

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

  // Nueva sección testimoniales
  const testimonials = [
    {
      quote: "HealPoint ha transformado completamente la gestión de mi consultorio. Ahora puedo atender más pacientes con menos estrés administrativo.",
      author: "Dra. María González",
      role: "Cardióloga"
    },
    {
      quote: "La facilidad para agendar citas y el sistema de recordatorios ha reducido nuestras cancelaciones en un 60%.",
      author: "Dr. Carlos Méndez",
      role: "Director Médico"
    },
    {
      quote: "Como paciente, valoro enormemente poder programar mis citas en cualquier momento del día sin tener que hacer llamadas telefónicas.",
      author: "Laura Martínez",
      role: "Paciente"
    }
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

  const carouselImages = [
    {
      src: medicoImage,
      alt: "Equipo médico profesional",
      title: "Atención de calidad garantizada",
      description: "Nuestro equipo de profesionales está listo para cuidar de tu salud",
    },
    {
      src: home2, 
      alt: "Instalaciones modernas",
      title: "Instalaciones de última generación",
      description: "Contamos con la tecnología más avanzada para tu atención",
    },
    {
      src: home3,
      alt: "Paciente satisfecho",
      title: "Experiencia centrada en el paciente",
      description: "Tu bienestar es nuestra prioridad número uno",
    },
  ];

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

      {/* Hero Section - Mejorado */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Su salud, nuestra prioridad
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Gestiona tus citas médicas de forma sencilla y eficiente. Encuentra los mejores especialistas para tu atención personalizada.
            </motion.p>
            
            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <button 
                className="primary-button"
                onClick={() => handleNavigate("cita-medica")}
              >
                <CalendarIcon />
                Agendar Cita
              </button>
              <button 
                className="secondary-button"
                onClick={() => scrollToEspecialidades()}
              >
                Ver Especialidades
              </button>
            </motion.div>
          </div>
          
          <div className="hero-image-container">
            <motion.div 
              className="hero-image"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Carousel images={carouselImages} autoplay={true} interval={5000} />
            </motion.div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="stats-container">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section - Mejorado */}
      <section className="features-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-description">
              HealPoint te ofrece todo lo que necesitas para gestionar tu salud con tecnología avanzada y atención personalizada.
            </p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Especialidades Section - Mejorado */}
      <section ref={especialidadesRef} className="especialidades-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="section-title">Nuestras Especialidades</h2>
            <p className="section-description">
              Contamos con un equipo de especialistas dedicados a brindarte la mejor atención en cada área de la salud.
            </p>
          </motion.div>
          
          <div className="especialidades-grid">
            {[
              {
                nombre: "Cardiología",
                descripcion: "Diagnóstico y tratamiento de enfermedades del corazón.",
                imagen: "/imgs/specialties/cardiologia.jpg",
                icono: "❤️"
              },
              {
                nombre: "Dermatología",
                descripcion: "Cuidado de la piel, cabello y uñas.",
                imagen: "/imgs/specialties/dermatologia.jpg",
                icono: "🧴"
              },
              {
                nombre: "Ginecología",
                descripcion: "Salud integral de la mujer.",
                imagen: "/imgs/specialties/ginecologia.jpg",
                icono: "👩"
              },
              {
                nombre: "Pediatría",
                descripcion: "Cuidado de la salud infantil.",
                imagen: "/imgs/specialties/pediatria.jpg",
                icono: "👶"
              },
              {
                nombre: "Neurología",
                descripcion: "Sistema nervioso y trastornos neurológicos.",
                imagen: "/imgs/specialties/neurologia.jpg",
                icono: "🧠"
              },
              {
                nombre: "Odontología",
                descripcion: "Salud bucal y tratamientos dentales.",
                imagen: "/imgs/specialties/odontologia.jpg",
                icono: "🦷"
              },
            ].map((esp, idx) => (
              <motion.div 
                key={idx} 
                className="especialidad-card"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05 * idx }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="especialidad-icon">{esp.icono}</div>
                <h3 className="especialidad-title">{esp.nombre}</h3>
                <p className="especialidad-description">{esp.descripcion}</p>
                <button 
                  className="especialidad-button"
                  onClick={() => handleNavigate("cita-medica")}
                >
                  Agendar Cita
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Nueva sección */}
      <section className="testimonials-section">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="section-title">Lo que dicen nuestros clientes</h2>
            <p className="section-description">
              Experiencias de pacientes y profesionales que confían en HealPoint
            </p>
          </motion.div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <svg className="quote-icon" width="36" height="36" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.04 4.171c0 0-.134.05-.322.098-.21.052-.474.102-.692.147-.431.097-.894.223-1.386.396-.494.191-.983.439-1.471.744-.363.364-.762.673-1.072 1.1-.317.41-.562.945-.762 1.45-.224.497-.395 1.06-.48 1.621-.17.56-.104 1.118-.104 1.621 0 .361.064.682.104 1.022.057.212.12.4.183.615.14.226.271.43.415.606.292.389.6.648.937.901.176.127.328.235.481.332.159.85.312.148.455.228l.036-.069c-.063-.038-.117-.104-.18-.143-.252-.152-.465-.333-.696-.517-.171-.17-.349-.317-.475-.544-.112-.24-.19-.474-.251-.705-.154-.547-.222-1.119-.104-1.69.11-.593.339-1.168.644-1.674.138-.238.306-.483.478-.671.9-.168.183-.33.293-.48.204-.275.405-.543.66-.787.253-.24.492-.457.776-.633.286-.197.582-.356.876-.487.314-.087.646-.152.882-.184.203-.038.39-.043.539-.05.149 0 .211 0 .211 0L8.047 5.437c0 0-.128.05-.356.099-.201.032-.438.103-.687.145-.216.073-.456.14-.689.228-.235.1-.453.161-.621.275-.214.092-.39.177-.539.253-.142.148-.305.233-.406.352-.206.133-.366.357-.54.493-.159.212-.3.444-.417.642-.194.404-.294.438-.369.785-.068.271-.092.558-.104.812 0 .224-.06.398 0 .535.064.181.063.367.134.535.07.143.117.283.196.415.031.064.083.216.12.331.191.383.459.746.945 1.022.208.231.484.46.775.506.297.14.625.029.903-.145.139-.104.301-.225.431-.484.172-.311.236-.651.235-1.171-.073-.367-.183-.699-.18-1.085z"></path>
                  <path fill="currentColor" d="M18.014 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197l-.667-1.793c0 0-.134.05-.322.098-.21.052-.474.102-.692.147-.431.097-.894.223-1.386.396-.494.191-.983.439-1.471.744-.363.364-.762.673-1.072 1.1-.317.41-.562.945-.762 1.45-.224.497-.395 1.06-.48 1.621-.17.56-.104 1.118-.104 1.621 0 .361.064.682.104 1.022.057.212.12.4.183.615.14.226.271.43.415.606.292.389.6.648.937.901.176.127.328.235.481.332.159.85.312.148.455.228l.036-.069c-.063-.038-.117-.104-.18-.143-.252-.152-.465-.333-.696-.517-.171-.17-.349-.317-.475-.544-.112-.24-.19-.474-.251-.705-.154-.547-.222-1.119-.104-1.69.11-.593.339-1.168.644-1.674.138-.238.306-.483.478-.671.9-.168.183-.33.293-.48.204-.275.405-.543.66-.787.253-.24.492-.457.776-.633.286-.197.582-.356.876-.487.314-.087.646-.152.882-.184.203-.038.39-.043.539-.05.149 0 .211 0 .211 0l-.333-1.793c0 0-.128.05-.356.099-.201.032-.438.103-.687.145-.216.073-.456.14-.689.228-.235.1-.453.161-.621.275-.214.092-.39.177-.539.253-.142.148-.305.233-.406.352-.206.133-.366.357-.54.493-.159.212-.3.444-.417.642-.194.404-.294.438-.369.785-.068.271-.092.558-.104.812 0 .224-.06.398 0 .535.064.181.063.367.134.535.07.143.117.283.196.415.031.064.083.216.12.331.191.383.459.746.945 1.022.208.231.484.46.775.506.297.14.625.029.903-.145.139-.104.301-.225.431-.484.172-.311.236-.651.235-1.171-.073-.367-.183-.699-.18-1.085z"></path>
                </svg>
                <p className="testimonial-text">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Nueva sección */}
      <section className="cta-section">
        <div className="cta-container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="cta-title">¿Listo para cuidar tu salud?</h2>
            <p className="cta-description">
              Agenda tu cita ahora y comienza a experimentar una atención médica de calidad
            </p>
            <button 
              className="cta-button"
              onClick={() => handleNavigate("cita-medica")}
            >
              Agendar Mi Primera Cita
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer - Mejorado */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logoBox">H</div>
                <span className="logoText">HealPoint</span>
              </div>
              <p className="footer-tagline">
                Cuidando tu salud con tecnología y profesionalismo
              </p>
            </div>
            
            <div className="footer-links">
              <div className="footer-links-column">
                <h4>Plataforma</h4>
                <button onClick={() => handleNavigate("home")}>Inicio</button>
                <button onClick={() => handleNavigate("cita-medica")}>Agendar Cita</button>
                <button onClick={() => handleNavigate("doctores/directorio")}>Directorio Médico</button>
              </div>
              
              <div className="footer-links-column">
                <h4>Soporte</h4>
                <button onClick={() => handleNavigate("contacto")}>Contáctenos</button>
                <button onClick={() => handleNavigate("preguntas-frecuentes")}>Preguntas Frecuentes</button>
                <button onClick={() => handleNavigate("ayuda")}>Ayuda</button>
              </div>
              
              <div className="footer-links-column">
                <h4>Legal</h4>
                <button onClick={() => handleNavigate("terminos")}>Términos de Uso</button>
                <button onClick={() => handleNavigate("privacidad")}>Política de Privacidad</button>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">© 2025 HealPoint. Todos los derechos reservados.</p>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </a>
              <a href="#" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                </svg>
              </a>
              <a href="#" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;