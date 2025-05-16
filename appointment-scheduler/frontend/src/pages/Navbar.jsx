import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn, navigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userEmail, setUserEmail] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const email = localStorage.getItem("userEmail") || "Usuario";
      setUserEmail(email);
    }

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoggedIn]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserMenuOpen(false);
    navigate("home");
  };

  const handleNavigate = (path) => {
    const protectedPaths = [
      "servicios/urgencias",
      "servicios/especialidades",
      "servicios/examenes",
      "servicios/tratamientos",
      "doctores/directorio",
      "doctores/especialistas",
      "doctores/horarios",
      "doctores/calificaciones",
      "pacientes/portal",
      "pacientes/historial",
      "pacientes/citas",
      "pacientes/medicamentos",
    ];

    if (protectedPaths.includes(path) && !isLoggedIn) {
      navigate("login");
    } else {
      navigate(path);
    }
  };

  const getUserDisplayName = () => {
    if (!userEmail) return "Usuario";
    if (userEmail.includes("@")) {
      const name = userEmail.split("@")[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return userEmail;
  };

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
                Mi Perfil
              </button>
              <button
                className="userMenuItem"
                onClick={() => handleNavigate("pacientes/citas")}
              >
                Mis Citas
              </button>
              <div className="userMenuDivider"></div>
              <button
                className="userMenuItem logoutMenuItem"
                onClick={handleLogout}
              >
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
          <button className="signUpButton" onClick={() => navigate("registro")}>
            Registrarse
          </button>
        </div>
      );
    }
  };

  const navOptions = [
    { name: "Inicio", path: "home" },
    {
      name: "Servicios",
      dropdown: true,
      items: [
        { name: "Asignar cita médica", path: "servicios/urgencias" },
        { name: "Especialidades", path: "servicios/especialidades" },
        { name: "Exámenes", path: "servicios/examenes" },
        { name: "Tratamientos", path: "servicios/tratamientos" },
      ],
    },
    {
      name: "Doctores",
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

  return (
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
                    className={`dropdown-arrow ${
                      openDropdown === index ? "rotated" : ""
                    }`}
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

        {renderAuthSection()}

        <button
          className={
            windowWidth <= 768 ? "mobileMenuButton" : "mobileMenuButton d-none"
          }
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Alternar menú"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

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
                    className={`dropdown-arrow mobile ${
                      openDropdown === index ? "rotated" : ""
                    }`}
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
                  handleNavigate("pacientes/citas");
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
  );
};

export default Navbar;
